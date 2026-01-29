const axios = require('axios');
const xml2js = require('xml2js');
const { format, addDays, isBefore } = require('date-fns'); 
const Performance = require('../models/Performance');

const API_KEY = process.env.KOPIS_API_KEY; 
const BASE_URL = 'http://www.kopis.or.kr/openApi/restful/pblprfr';

const parser = new xml2js.Parser({ explicitArray: false });

// 메인 함수 - 공연 목록 수집 및 DB 저장
async function fetchAndSavePerformances() {
  const targetStates = ['01', '02'];
  
  try {
    const today = new Date();
    const futureDate = addDays(today, 30);
    const stdate = format(today, 'yyyyMMdd');
    const eddate = format(futureDate, 'yyyyMMdd');

    console.log(`[System] 수집 시작 (${stdate} ~ ${eddate})`);
    let totalSaved = 0;

    for (const state of targetStates) {
      const items = await fetchFromApi(state, stdate, eddate); // api 호출 
      if (items.length > 0) {
        const savedCount = await saveToDB(items); // 응답, db저장
        totalSaved += savedCount;
      }
    }
    console.log(`[System] 총 ${totalSaved}개 처리 완료`);

  } catch (error) {
    console.error('[Error] 수집 및 저장 전체 프로세스 실패:', error);
  }
}

// API 호출 
async function fetchFromApi(state, stdate, eddate) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        service: API_KEY,
        stdate, eddate,
        cpage: 1, rows: 100, prfstate: state,
      }
    });
    const result = await parser.parseStringPromise(response.data);
    
    if (!result?.dbs?.db) return [];
    return Array.isArray(result.dbs.db) ? result.dbs.db : [result.dbs.db];

  } catch (e) {
    console.error(`API 호출 실패 (${state}):`, e.message);
    return [];
  }
}

// DB 저장
async function saveToDB(items) {
  let count = 0;
  for (const item of items) {
    try {
      const endDate = new Date(item.prfpdto.replace(/\./g, '-'));
      const status = isBefore(endDate, new Date()) ? 'ARCHIVED' : 'ACTIVE';

      await Performance.findOneAndUpdate(
        { mt20id: item.mt20id },
        {
          $set: {
            mt20id: item.mt20id,
            prfnm: item.prfnm,
            prfpdfrom: item.prfpdfrom,
            prfpdto: item.prfpdto,
            fcltynm: item.fcltynm,
            poster: item.poster,
            genrenm: item.genrenm,
            prfstate: item.prfstate,
            status: status,
            updatedAt: new Date()
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
    } catch (e) {
      console.error(`DB 저장 실패 (${item.prfnm}):`, e.message);
    }
  }
  return count;
}
// --------------------------------------------------------------

//상세 정보 업데이트 (2단계 수집) - 공연 하나 
async function updateDetailInfo(limitCount = 50) {
  try {
    // 1. 상세 정보가 없는(mt10id- 공연시설 정보가 없는) 공연 찾기 
    // 상태가 ACTIVE인 것만 조회하여 불필요한 API 호출 방지
    const targets = await Performance.find({ 
      mt10id: { $exists: false },
      status: 'ACTIVE' 
    }).limit(limitCount);

    if (targets.length === 0) {
      console.log('[System] 업데이트할 상세 정보가 없습니다.');
      return 0;
    }

    console.log(`[System] ${targets.length}개의 상세 정보 업데이트 시작...`);
    let updatedCount = 0;

    for (const doc of targets) {
      const detailData = await fetchDetailFromApi(doc.mt20id);
      
      if (detailData) {
        // XML 데이터 매핑 및 업데이트
        await Performance.updateOne(
          { _id: doc._id },
          {
            $set: {
              mt10id: detailData.mt10id,        // 공연시설 ID
              pcseguidace: detailData.pcseguidance, // 티켓 가격
              sty: detailData.sty,  // 줄거리 (배열일 수 있어 처리 필요)
              prfrunstime: detailData.prfrunstime, // 공연 시간
              updatedAt: new Date()
            }
          }
        );
        updatedCount++;
        // 부하 방지 대기시간
        await new Promise(r => setTimeout(r, 100)); 
      }
    }

    console.log(`[System] ${updatedCount}개의 상세 정보 업데이트 완료`);
    return updatedCount;

  } catch (error) {
    console.error('[Error] 상세 정보 업데이트 중 실패:', error);
  }
}

async function fetchDetailFromApi(mt20id) {
  try {
    const response = await axios.get(`${BASE_URL}/${mt20id}`, {
      params: { service: API_KEY }
    });

    const result = await parser.parseStringPromise(response.data);
    
    // 데이터 구조 확인 (db > db 형태)
    if (result && result.dbs && result.dbs.db) {
      return result.dbs.db;
    }
    return null;

  } catch (e) {
    console.error(`상세 API 호출 실패 (${mt20id}):`, e.message);
    return null;
  }
}

module.exports = { fetchAndSavePerformances, updateDetailInfo };
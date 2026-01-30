const Performance = require('../models/Performance');

// [GET] 공연 목록 조회
const getList = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      genre,      // 장르 필터
      state,      // 상태 필터 
      area,       // 지역 필터
      sort,       // 정렬 기준
      search      // 검색어
    } = req.query;

    // 1. 쿼리 빌더 초기화 (삭제된 것 제외)
    const query = { };

    // 2. 조건 추가
    if (genre) query.genrenm = genre;
    if (state) query.prfstate = state;
    if (area) query.area = area; 
    
    // 검색 (공연명 or 시설명)
    if (search) {
      query.$or = [
        { prfnm: { $regex: search, $options: 'i' } },
        { fcltynm: { $regex: search, $options: 'i' } }
      ];
    }

    // 3. 정렬 옵션 설정
    let sortOption = { prfpdfrom: -1 }; // 기본: 최신순 (시작일 내림차순)
    if (sort === 'views') sortOption = { viewCount: -1 };      // 조회수순
    else if (sort === 'likes') sortOption = { likeCount: -1 }; // 좋아요순
    else if (sort === 'rating') sortOption = { averageRating: -1 }; // 평점순
    else if (sort === 'end') sortOption = { prfpdto: 1 };      // 마감임박순

    // 4. DB 조회 (페이징 적용)
    const performances = await Performance.find(query)
      .select('mt20id prfnm poster fcltynm prfpdfrom prfpdto genrenm prfstate viewCount averageRating') // 목록에 필요한 필드만 선택 (최적화)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // 5. 전체 개수 계산 (프론트 페이징 처리용)
    const totalCount = await Performance.countDocuments(query);

    res.json({
      success: true,
      data: performances,
      pagination: {
        currentPage: Number(page),
        totalPage: Math.ceil(totalCount / limit),
        totalCount
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '목록 조회 실패' });
  }
};

// [GET] 공연 상세 조회
// 예시: /api/performances/PF224446
const getDetail = async (req, res) => {
  try {
    const { id } = req.params; // mt20id

    // 조회수 1 증가 + 상세 정보 가져오기
    const performance = await Performance.findOneAndUpdate(
      { mt20id: id },
      { $inc: { viewCount: 1 } }, 
      { new: true }
    );

    if (!performance) {
      return res.status(404).json({ success: false, message: '공연 정보를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: performance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '상세 조회 실패' });
  }
};

// [GET] 추천/랭킹 공연 (메인페이지용)
// 예시: /api/performances/ranking (조회수 Top 5)
const getRanking = async (req, res) => {
  try {
    const top10 = await Performance.find({ status: 'ACTIVE' })
      .sort({ viewCount: -1 }) // 조회수 내림차순
      .limit(10)
      .select('mt20id prfnm poster genrenm');

    res.json({ success: true, data: top10 });
  } catch (err) {
    res.status(500).json({ success: false, message: '랭킹 조회 실패' });
  }
};

module.exports = { getList, getDetail, getRanking };
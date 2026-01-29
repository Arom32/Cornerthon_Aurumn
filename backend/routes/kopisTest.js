const express = require('express');
const router = express.Router();
const { fetchAndSavePerformances, updateDetailInfo } = require('../services/kopis');
const Performance = require('../models/Performance');

// [기본 수집] 공연 목록 가져오기 ( http://localhost:3000/test/fetch )
router.get('/fetch', async (req, res) => {
  try {
    console.log('--- 공연 목록 수집 시작 ---');
    await fetchAndSavePerformances();
    res.send('공연 목록 수집이 완료되었습니다. (콘솔 확인)');
  } catch (err) {
    console.error(err);
    res.status(500).send('목록 수집 중 에러 발생');
  }
});

// [상세 수집] 비어있는 상세정보 채우기 ( http://localhost:3000/test/detail )
router.get('/detail', async (req, res) => {
  try {
    console.log('--- 상세 정보 업데이트 시작 ---');
    const count = await updateDetailInfo(); 
    res.send(`${count}개의 공연 상세정보를 업데이트했습니다.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('상세 수집 중 에러 발생');
  }
});

// DB에 몇 개나 저장됐는지 보기 ( http://localhost:3000/test/count )
router.get('/count', async (req, res) => {
  try {
    const total = await Performance.countDocuments({});
    const active = await Performance.countDocuments({ status: 'ACTIVE' });
    const noDetail = await Performance.countDocuments({ mt10id: { $exists: false } });

    res.json({
      total_performances: total,    // 전체 저장된 수
      active_performances: active,  // 현재 상영/예정 중인 수
      need_detail_update: noDetail  // 상세 정보 업데이트 필요한 수
    });
  } catch (err) {
    res.status(500).send('DB 조회 실패');
  }
});

module.exports = router;
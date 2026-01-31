const Performance = require('../models/Performance');
const { 
    validateFilter,
    parseGenreFilter, 
    getSortOption,
    ALLOWED_STATES, 
    ALLOWED_AREAS
} = require('../utils/performanceUtils');

/** [GET] 공연 목록 조회 (페이징, 필터링, 정렬, 검색)
 * * @param {Object} req - Express request object
 * @param {Object} req.query - 쿼리 스트링 파라미터
 * @param {number} [req.query.page=1] - 조회할 페이지 번호
 * @param {number} [req.query.limit=10] - 페이지당 아이템 개수
 * @param {string|string[]} [req.query.genre] - 장르 필터 (쉼표 구분 또는 배열)
 * @param {string} [req.query.state] - 공연 상태 필터 (공연중, 공연예정 등)
 * @param {string} [req.query.area] - 지역 필터 (서울, 경기 등)
 * @param {string} [req.query.sort] - 정렬 기준 (views, likes, rating, end)
 * @param {string} [req.query.search] - 검색어 (공연명 또는 시설명)
 * * @param {Object} res - Express response object
 * @returns {Promise<void>} - JSON 응답 (success, data, pagination)
 */
async function getList(req, res) {
    try {
        const { 
            page = 1, 
            limit = 20, 
            genre, 
            state, 
            area, 
            sort, 
            search 
        } = req.query;

        const query = {};

        // 장르 필터링 
        const targetGenres = parseGenreFilter(genre);
        if (targetGenres.length > 0) {
            query.genrenm = { $in: targetGenres };
        }

        // 상태 필터링
        const validState = validateFilter(state, ALLOWED_STATES);
        if (validState) query.prfstate = validState;

        // 지역 필터링
        const validArea = validateFilter(area, ALLOWED_AREAS);
        if (validArea) query.area = validArea;

        // 공연명 또는 시설명 검색 처리
        if (search) {
            query.$or = [
                { prfnm: { $regex: search, $options: 'i' } },
                { fcltynm: { $regex: search, $options: 'i' } }
            ];
        }

        //  DB 조회 / 페이징
        const skipCount = (Number(page) - 1) * Number(limit);

        const performances = await Performance.find(query)
            .select('mt20id prfnm poster fcltynm prfpdfrom prfpdto genrenm prfstate viewCount averageRating')
            .sort(getSortOption(sort)) // Utils 함수 활용 정렬
            .skip(skipCount)
            .limit(Number(limit));

        // 전체 데이터 개수 확인
        const totalCount = await Performance.countDocuments(query);

        res.json({
            success: true,
            data: performances,
            pagination: {
                currentPage: Number(page),
                totalPage: Math.ceil(totalCount / Number(limit)),
                totalCount
        }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '목록 조회 실패' });
    }
}

/**[GET] 공연 상세 조회
 * @param {import('express').Request} req -  perfomance id
 * @param {import('express').Response} res - perfomance object
 */
async function getDetail(req, res) {
    try {
        const { id } = req.params;

        const performance = await Performance.findOneAndUpdate(
            { mt20id: id },
            { $inc: { viewCount: 1 } }, // 해당 공연의 조회수 증가
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
}


/**
 * [GET] 랭킹 조회 (서버 ACTIVE 데이터 기준 Top 10)
 * @param {import('express').Request} req - none
 * @param {import('express').Response} res - top 10 performance list
 */
async function getRanking(req, res) {
    try {
        const { genre } = req.query;
        const query = { status: 'ACTIVE' }; 

        // 장르 필터
        const targetGenres = parseGenreFilter(genre);
        if (targetGenres.length > 0) {
            query.genrenm = { $in: targetGenres };
        }

        const top10 = await Performance.find(query)
            .sort({ viewCount: -1 })    
            .limit(10)
            .select('mt20id prfnm poster genrenm viewCount');

        res.json({ 
            success: true, 
            data: top10 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '랭킹 조회 실패' });
    }
}
    
module.exports = { getList, getDetail, getRanking };
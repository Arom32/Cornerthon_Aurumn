const ALLOWED_GENRES = ['연극',
      '서양음악(클래식)', '뮤지컬', '한국음악(국악)',
      '대중음악', '무용(서양/한국무용)',
      '대중무용', '서커스/마술', '복합'];

const ALLOWED_STATES = ['공연중', '공연예정', '공연완료'];

const ALLOWED_AREAS = [
    '서울특별시','부산광역시','대구광역시','인천광역시','광주광역시',
    '대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도',
    '충청북도','충청남도','전라북도','전라남도','경상북도','경상남도',
    '제주특별자치도',
];


/**
 * 장르 파라미터를 DB 쿼리용 배열로 변환하는 함수
 * @param {string|string[]} genre - query string (CSV 또는 Array)
 * @returns {string[]} - 검증 및 중복 제거된 장르 배열
 */
function parseGenreFilter(genre) {
    if (!genre) return [];

    // 대중무용,etc -> [대중무용, etc]로 변횐
    const genreInput = Array.isArray(genre) 
        ? genre 
        : String(genre).split(',').map(g => g.trim());

    const validatedGenres = genreInput.filter(g => ALLOWED_GENRES.includes(g));

    return [...new Set(validatedGenres)];
}

/**
 * 정렬 옵션을 반환하는 함수
 * @param {string} sort - 정렬 기준 (views, likes, rating, end)
 * @returns {Object} - Mongoose 정렬 옵션 객체
 */
function getSortOption(sort) {
    switch (sort) {
        case 'views': return { viewCount: -1 };
        case 'likes': return { likeCount: -1 };
        case 'rating': return { averageRating: -1 };
        case 'end': return { prfpdto: 1 };
        default: return { prfpdfrom: -1 };
    }
}

function validateFilter(value, allowedList) {
    return allowedList.includes(value) ? value : undefined;
}

module.exports = { 
    ALLOWED_GENRES, 
    ALLOWED_STATES, 
    ALLOWED_AREAS,
    parseGenreFilter, 
    getSortOption,
    validateFilter
};
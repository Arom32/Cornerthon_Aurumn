const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    // KOPIS 기본 데이터 매핑 (식별 및 정보 표시용) 
    mt20id: {  // KOPIS 공연 ID
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    prfnm: { type: String, required: true }, // 공연명
    genrenm: { type: String }, // 장르 (연극, 뮤지컬 등)
    prfstate: { type: String }, // KOPIS상 상태 (공연중, 공연예정 등)
    prfpdfrom: { type: String, required: true }, // 시작일 (YYYY.MM.DD)
    prfpdto: { type: String, required: true },   // 종료일
    poster: { type: String }, // 포스터 이미지 URL
    fcltynm: { type: String, required: true },   // 공연 시설명
    area : { type: String }, // 지역

    // KOPIS 상세 데이터
    mt10id : { type: String }, // 공연시설 ID
    pcseguidace : { type: String }, // 티켓 가격
    sty : { type: String }, // 줄거리
    prfrunstime : { type: String }, // 공연 런타임
    

    // 서비스 내부 관리용 필드 (데이터 생명주기)
    status: {
        type: String,
        enum: ['ACTIVE', 'ARCHIVED', 'LEGACY'],
        default: 'ACTIVE'
    },

    // 서비스 내부 추천용 필드 (관심도 측정)
    viewCount: { type: Number, default: 0 }, // 조회수
    likeCount: { type: Number, default: 0 }, // 좋아요 수
    averageRating: { type: Number, default: 0 }, // 평균 별점 
    reviewCount: { type: Number, default: 0 }, // 리뷰 수

    // 메타 데이터
    crawledAt: { type: Date, default: Date.now } // 데이터 수집 시점
});

// 모델 생성
const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
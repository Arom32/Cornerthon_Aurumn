const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        // 유저 이름
        username: {
            type: String,
            required: true,
            unique: true
        },
        // 비밀번호
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        // 현재 레벨
        level: {
            type: Number,
            default: 1,
        },
        // 현재 포인트
        point: {
            type: Number,
            default: 0,
        },
        // 칭호
        title: {
            type: String,
            default: "새싹 관람객",
        },
        // 주간/월간 관람자 랭킹
        weeklyViewCount: {
            type: Number,
            default: 0
        },
        monthlyViewCount: {
            type: Number,
            default: 0
        },
         totalViewCount: {
            type: Number,
            default: 0
        },
        // 최다 추천 리뷰어 랭킹
        // 유저가 받은 추천 개수
        likesCount: {
            type: Number,
            default: 0
        },
        // 유저가 쓴 리뷰 게시물 개수
        reviewCount: {
            type: Number,
            default: 0
        },
        // 활동 데이터 관리
        lastActivityDate: { type: Date, default: Date.now } 
}
    , { timestamps: true }
)

// 모델 생성
const user = mongoose.model("User", userSchema)
module.exports = user
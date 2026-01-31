const mongoose = require("mongoose")

const boardSchema = new mongoose.Schema(
    {
        // 게시판 구분 (후기, 질문, 공지, 자유, 거래 게시판)
        category: {
            type: String,
            required: true,
            enum: ["review", "question", "notice", "general", "trade"]
        },
        title: { type: String, required: true }, // 게시물 제목
        description: { type: String, required: true }, // 게시물 내용
        comments: [{ type: mongoose.Schema.Types.ObjectId }], // 댓글 배열
        // 작성자
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 후기 게시판용 (공연 연동)
        PerformId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Performance" // 어떤 공연에 대한 리뷰인지
        },
        price: { type: Number }, // 가격
        tradeStatus: {
            type: String,
            enum: ["available", "reserved", "completed"], // 거래 가능, 예약중, 완료
            default: "available"
        },
        // 추천한 유저들의 id 배열 (중복 방지용)
        wholikes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]
}, { timestamps: true }
)

const board = mongoose.model("Board", boardSchema)
module.exports = board
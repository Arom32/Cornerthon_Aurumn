const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        // 작성자
        creator: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required: true,
            index: true
        },

        // 댓글이 달린 게시문
        boardId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Board',
            required: true,
            index: true
        },

        // 대댓글 - 부모 댓글 ID , null -> 일반 댓글
        parentCommentId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment',
            default: null,
            index: true
        },

        // 내용
        content: {
            type: String,
            required: true,
            trim: true,
        },

        // 삭제 여부 플래그
        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        }

    }, { timestamps: true }
)

// 댓글 조회 시 삭제된 댓글은 내용이 "삭제된 댓글입니다."로 표시되도록 설정
commentSchema.post(['find', 'findOne'], function(docs) {
    if (!docs) return;

    const transform = (doc) => {
        if (doc.isDeleted) {
            doc.content = "삭제된 댓글입니다.";
            doc.creator = null; 
        }
    };

    if (Array.isArray(docs)) {
        docs.forEach(transform);
    } else {
        transform(docs);
    }
});

const comment = mongoose.model("Comment", commentSchema);
module.exports = comment;
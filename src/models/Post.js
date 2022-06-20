import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 600
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    }
);

const post = mongoose.model("Post", PostSchema);

export default post;
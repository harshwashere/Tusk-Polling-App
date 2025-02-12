import mongoose, { Schema, model } from "mongoose";

const PollSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    options: [{
        optiontext: { type: Object, required: true }
    }, {
        votes: { type: Number, default: 0 }
    }],
    response: [{
        voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        responseText: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    closed: {
        type: Boolean,
        default: false
    },
})

const Poll = model("Poll", PollSchema)

export default Poll
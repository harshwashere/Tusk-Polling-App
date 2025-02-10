import { Schema, model } from "mongoose";

const PollSchema = new Schema({
    question: {
        type: String,
        required: true
    }, type: {
        type: String,
        required: true
    }, options: [{
        optiontext: { type: String, required: true },
        votes: { type: Number, default: 0 }
    }],
    response: [{
        voterId: { type: Schema.Types.ObjectId, ref: "User" },
        responseText: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    voters: [{
        type: Schema.Types.ObjectId,
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
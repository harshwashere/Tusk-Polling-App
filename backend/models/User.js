import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileimageUrl: {
        type: String,
        default: null
    },
    bookmarkedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll"
    }],
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.comparepassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = model('User', UserSchema)

export default User 
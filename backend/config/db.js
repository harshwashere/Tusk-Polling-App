import mongoose from "mongoose";

const connection = async() =>{
    try {
        const db = mongoose.connect(process.env.MONGOURI)

        if(db) {
            console.log("Database is connected")
        } else {
            console.log("Can't connect to database")
        }
    } catch (error) {
        console.error(error)
    }
}

export default connection
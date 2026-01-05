import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("DataBase connected succesfully!");
        })
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.log("Error while connecting the DB", error);
    }
}
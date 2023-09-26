import { Schema, model } from "mongoose";
import { User } from "discord.js";// Import the Client class

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: String,
    ltuid: String,
    ltoken: String,
    uid: String
});

export default model("User", userSchema, "Users");

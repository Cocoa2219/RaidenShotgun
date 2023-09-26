import { SlashCommandBuilder } from "discord.js";
import pkg from "discord.js"; // Import the 'discord.js' package as a whole
const { EmbedBuilder } = pkg;// Access the MessageEmbed class from the package
import User from "../schemas/user.js";
import mongoose from "mongoose";

export default {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("유저 등록"),
    async execute(client, interaction) {

        await interaction.reply({})

        const user = await new User({
            _id: new mongoose.Types.ObjectId(),
            user: interaction.user.tag,
            ltuid: "",
            ltoken: "",
            uid: ""
        })

        await user.save();
    }
};

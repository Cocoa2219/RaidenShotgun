import {ActionRow, ComponentType, SlashCommandBuilder, TextInputStyle, ButtonStyle, InteractionCollector, InteractionType, TextInputComponent, AttachmentBuilder} from "discord.js";
import pkg from "discord.js"; // Import the 'discord.js' package as a whole
const { EmbedBuilder } = pkg;// Access the MessageEmbed class from the package
import User from "../schemas/user.js";
import mongoose from "mongoose";
import { GenshinImpact, LanguageEnum } from 'hoyoapi'
import Canvas, {GlobalFonts} from "@napi-rs/canvas";
import path from "path";
import { readFileSync, writeFileSync } from 'fs'
import {fileURLToPath} from "url";
import {request} from "undici";

export default {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("자동 출석체크"),
    async execute(client, interaction) {
        await (async () => {
            mongoose.set("strictQuery", false);
            await mongoose
                .connect("mongodb+srv://cocoa:1234@raidenshogun.bvynira.mongodb.net", {dbName: "RaidenShogun"})
                .catch(console.error);
        })();
        User.findOne({user: interaction.user.tag}).then(async (docs) => {
            if (docs.length !== 0) {
                const genshin = new GenshinImpact({
                    cookie: {
                        ltuid: docs.ltuid,
                        ltoken: docs.ltoken
                    },
                    language: LanguageEnum.KOREAN,
                    uid: docs.uid
                })

            } else {
                interaction.reply({content: "미안하지만 너와 관련된 계정을 찾을 수 없어.", ephemeral: true})
            }
        })
    }
};

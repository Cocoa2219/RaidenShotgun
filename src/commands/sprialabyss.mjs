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
        .setName("sprialabyss")
        .setDescription("나선 비경 정보"),
    async execute(client, interaction) {
        await (async () => {
            mongoose.set("strictQuery", false);
            await mongoose
                .connect("mongodb+srv://cocoa:1234@raidenshogun.bvynira.mongodb.net", {dbName: "RaidenShogun"})
                .catch(console.error);
        })();
        User.findOne({user: interaction.user.tag}).then(async (docs) => {
            // noinspection PointlessBooleanExpressionJS
            if (/*docs !== null*/ true) {
                let currentData;
                let previousData;
                /*
                const genshin = new GenshinImpact({
                    cookie: {
                        ltuid: docs.ltuid,
                        ltoken: docs.ltoken
                    },
                    language: LanguageEnum.KOREAN,
                    uid: docs.uid,
                    region: docs.region
                })

                genshin.record.spiralAbyss(1).then(data => currentData = data);
                genshin.record.spiralAbyss(2).then(data => previousData = data);*/

                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                const fontPath = path.join(__dirname, "..", ".." ,"res", "Fonts", "NotoSansKR-Black.ttf")
                const fontData = readFileSync(fontPath);

                GlobalFonts.register(fontData)

                const canvas = Canvas.createCanvas(700, 250);
                const context = canvas.getContext('2d');
                const background = await Canvas.loadImage("../res/SprialBG.png")
                context.drawImage(background, 0, 0, canvas.width, canvas.height);


                const avatar = await Canvas.loadImage("../res/Raiden.png")

                context.drawImage(avatar, canvas.width / 1.45, canvas.height / 1.22, 40, 40)

                context.font = '30px IBM Plex Sans KR SemiBold'
                context.fillStyle = "#ffffff"

                context.fillText(`공돌이 라이덴`, canvas.width / 1.327, canvas.height / 1.06)

                const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "spiral.png"});

                interaction.reply({files: [attachment]})
            } else {
                // noinspection UnreachableCodeJS
                interaction.reply({content: "미안하지만 너와 관련된 계정을 찾을 수 없어.", ephemeral: true})
            }
        })
    }
};

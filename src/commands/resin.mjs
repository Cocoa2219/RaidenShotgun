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
        .setName("resin")
        .setDescription("현재 레진 상태를 확인해."),
    async execute(client, interaction) {
        await (async () => {
            mongoose.set("strictQuery", false);
            await mongoose
                .connect("mongodb+srv://cocoa:1234@raidenshogun.bvynira.mongodb.net", {dbName: "RaidenShogun"})
                .catch(console.error);
        })();
        User.findOne({user: interaction.user.tag}).then(async (docs) => {
          if(docs !== null) {
              const genshin = new GenshinImpact({
                  cookie: {
                      ltuid: docs.ltuid,
                      ltoken: docs.ltoken
                  },
                  language: LanguageEnum.KOREAN,
                  uid: docs.uid
              })

              genshin.record.dailyNote().then(async (info) => {
                  const __filename = fileURLToPath(import.meta.url);
                  const __dirname = path.dirname(__filename);

                  const fontPath = path.join(__dirname, "..", ".." ,"res", "Fonts", "NotoSansKR-Black.ttf")
                  const fontData = readFileSync(fontPath);

                  GlobalFonts.register(fontData)

                  const canvas = Canvas.createCanvas(700, 250);
                  const context = canvas.getContext('2d');
                  const background = await Canvas.loadImage("../res/ResinBG.png")

                  context.drawImage(background, 0, 0, canvas.width, canvas.height);

                  const resinIcon = await Canvas.loadImage("../res/Resin.png")

                  context.drawImage(resinIcon, 20, 25, 200, 200)

                  context.font = '60px IBM Plex Sans KR SemiBold';

                  context.fillStyle = "#ffffff"

                  context.fillText(`${info.current_resin} / ${info.max_resin}`, canvas.width / 3, canvas.height / 2.45)

                  context.font = '30px IBM Plex Sans KR Medium'

                  const recoveryTime = new Date(info.resin_recovery_time * 1000).toISOString().substring(11, 19)

                  context.fillText(`모든 레진이 찰 때까지 ${recoveryTime}.`, canvas.width / 3, canvas.height / 1.75)

                  const recoveryTimeOne = new Date((info.resin_recovery_time % 480) * 1000).toISOString().substring(14, 19)

                  context.font = '25px IBM Plex Sans KR Light'

                  context.fillText(`레진 1개가 찰 때까지 ${recoveryTimeOne}.`, canvas.width / 3, canvas.height / 1.39)

                  const avatar = await Canvas.loadImage("../res/Raiden.png")

                  context.drawImage(avatar, canvas.width / 1.45, canvas.height / 1.22, 40, 40)

                  context.font = '30px IBM Plex Sans KR SemiBold'

                  context.fillText(`공돌이 라이덴`, canvas.width / 1.327, canvas.height / 1.06)

                  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "resin.png"});

                  interaction.reply({files: [attachment]})
              })

          }
          else {
              interaction.reply({ content: "넌... 흠. 등록이 되어있지 않군. /register을 이용해서 등록을 해라."})
          }
        })
    }
};

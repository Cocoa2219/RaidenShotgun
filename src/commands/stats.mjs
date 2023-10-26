import {ActionRow, ComponentType, SlashCommandBuilder, TextInputStyle, ButtonStyle, InteractionCollector, InteractionType, TextInputComponent, AttachmentBuilder} from "discord.js";
import pkg from "discord.js"; // Import the 'discord.js' package as a whole
const { EmbedBuilder } = pkg;// Access the MessageEmbed class from the package
import Canvas, {GlobalFonts} from "@napi-rs/canvas";
import path from "path";
import { readFileSync, writeFileSync } from 'fs'
import {fileURLToPath} from "url";
import {request} from "undici";

export default {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("전적 테스트")
        .addIntegerOption(option => option.setName("kill").setDescription("kill").setRequired(true))
        .addIntegerOption(option => option.setName("death").setDescription("death").setRequired(true))
        .addIntegerOption(option => option.setName("damage").setDescription("damage").setRequired(true))
    ,
    async execute(client, interaction) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const fontPath = path.join(__dirname, "..", "..", "res", "Fonts", "NotoSansKR-Black.ttf")
        const fontData = readFileSync(fontPath);

        GlobalFonts.register(fontData)

        const canvas = Canvas.createCanvas(960, 540);
        const context = canvas.getContext('2d');

        // random 1 ~ 7
        const random = Math.floor(Math.random() * 7) + 1

        const background = await Canvas.loadImage(`../res/BG/BG${random}.png`)

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const profileImage = await Canvas.loadImage("../res/Raiden.png")

        context.drawImage(profileImage, 20, 25, 200, 200)

        context.font = '70px IBM Plex Sans KR SemiBold';

        context.fillStyle = "#ffffff"

        context.fillText(`라이덴 쇼군`, 240 , 90)

        context.font = '45px IBM Plex Sans KR Light'

        context.fillText("76561199325787045@steam", 240, 165)

        context.font = '50px IBM Plex Sans KR Light'

        context.fillText("| 사살 : ", 30, 300)

        context.font = '50px IBM Plex Sans KR Medium'

        context.fillText(`${new Intl.NumberFormat('ko-kr').format(interaction.options.getInteger('kill'))}명`, 187, 303)

        context.font = '50px IBM Plex Sans KR Light'

        context.fillText("| 사망 : ", 30, 370)

        context.font = '50px IBM Plex Sans KR Medium'

        context.fillText(`${new Intl.NumberFormat('ko-kr').format(interaction.options.getInteger('death'))}번`, 187, 373)

        context.font = '50px IBM Plex Sans KR Light'

        context.fillText("| 데미지 : ", 30, 440)

        context.font = '50px IBM Plex Sans KR Medium'

        context.fillText(`${new Intl.NumberFormat('ko-kr').format(interaction.options.getInteger('damage'))}pt`, 227, 443)

        const avatar = await Canvas.loadImage("../res/RushServer.png")

        context.drawImage(avatar, 630 , 450, 80, 80)

        context.font = '50px IBM Plex Sans KR SemiBold'

        context.fillText(`Rush 서버`, 725, 508)

        const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "stats.png"});

        interaction.reply({files: [attachment]})
    }
};

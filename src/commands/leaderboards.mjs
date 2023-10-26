import {AttachmentBuilder, SlashCommandBuilder} from "discord.js";
import Canvas from "@napi-rs/canvas";
import sharp from "sharp";
import {request} from "undici";
import fs from "fs";

function fittingString(c, str, maxWidth) {
    let width = c.measureText(str).width;
    const ellipsis = '…';
    const ellipsisWidth = c.measureText(ellipsis).width;
    if (width<=maxWidth || width<=ellipsisWidth) {
        return str;
    } else {
        let len = str.length;
        while (width>=maxWidth-ellipsisWidth && len-->0) {
            str = str.substring(0, len);
            width = c.measureText(str).width;
        }
        return str+ellipsis;
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboards')
        .setDescription('순위 테스트'),
    async execute(client, interaction) {
        const random = Math.floor(Math.random() * 7) + 1

        const background = await Canvas.loadImage(`../res/BG/BGL${random}.png`)
        let canvas = Canvas.createCanvas(1280, 160);
        let ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, 1280, 160, 0, 0, canvas.width, canvas.height);

        const square = await Canvas.loadImage('../res/WhiteSquare.png')
        const avatar = await Canvas.loadImage("../res/RushServer.png")
        const filePath = '../res/leaderboards.json'

        //read file and parse
        let leaderboardsRaw = fs.readFileSync(filePath);
        // define leaderboards and put parsed data like this: {name: 'name', kills: 0, damage: 0}
        let leaderboardsObject = JSON.parse(leaderboardsRaw);
        let leaderboards = [];

        for (let i = 0; i < leaderboardsObject.length; i++) {
            let name = leaderboardsObject[i].name
            let kills = leaderboardsObject[i].kill
            let damage = leaderboardsObject[i].damage
            leaderboards.push({name: name, kills: kills, damage: damage})
        }
        leaderboards.sort((a, b) => {
            return b.kill - a.kill
        })


        ctx.drawImage(avatar, 30, 20, 120, 120);

        ctx.font = '60px IBM Plex Sans KR Light'
        ctx.fillStyle = '#ffffff'

        // move to center
        ctx.fillText('SCP: SL',165, 60)

        ctx.font = '60px IBM Plex Sans KR Medium'
        ctx.fillText('Rush Server',165, 135)

        ctx.font = '80px IBM Plex Sans KR SemiBold'

        ctx.fillText('Leaderboards', 730, 88)

        ctx.font = '40px IBM Plex Sans KR Light'
        ctx.fillText('(Kills / Damage)', 1000, 140)

        // draw line between SCP:SL and Rush Server
        ctx.beginPath();
        ctx.moveTo(165, 78);
        ctx.lineTo(705, 78);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        interaction.channel.send({
            files: [
                new AttachmentBuilder(await canvas.encode('png'), {name: "title.png"})
            ]
        })

        interaction.reply('순위 테스트')

        let body;
        let displayAvatar;

        for (let i = 1; i < 26; i++) {
            canvas = Canvas.createCanvas(1280, 80);
            ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 160 + ((i-1) * 80), 1280, 80, 0, 0, canvas.width, canvas.height);

            ctx.font = '60px IBM Plex Sans KR SemiBold'
            if (i === 1) {
                // gold
                ctx.fillStyle = '#ffd700'
                ctx.fillText('#1', 30, 60)
            } else if (i === 2) {
                // sliver
                ctx.fillStyle = '#c0c0c0'
                ctx.fillText('#2', 30, 60)
            } else if (i === 3) {
                // bronze
                ctx.fillStyle = '#cd7f32'
                ctx.fillText('#3', 30, 60)
            } else {
                ctx.fillStyle = '#ffffff'
                ctx.fillText(`#${i}`, 30, 60)
            }

            ctx.font = '60px IBM Plex Sans KR SemiBold'
            ctx.fillStyle = '#ffffff'

            ctx.fillText(fittingString(ctx, leaderboards[i-1].name, 320), 240, 60);


            /*
            if (leaderboards[i-1].name.length > 5) {
                ctx.fillText(leaderboards[i-1].name.substring(0, 5) + "...", 240, 60)
            } else {
                ctx.fillText(leaderboards[i-1].name, 240, 60)
            } */

            const killGradient = ctx.createLinearGradient(600, 0, ctx.measureText(new Intl.NumberFormat('ko-kr').format(leaderboards[0].kills)).width + 600, 0);
            killGradient.addColorStop(0, '#12c2e9');
            killGradient.addColorStop(0.5, '#c471ed');
            killGradient.addColorStop(1, '#f64f59');
            const damageGraident = ctx.createLinearGradient(800, 0, ctx.measureText(new Intl.NumberFormat('ko-kr').format(leaderboards[0].damage)).width + 800, 0);
            damageGraident.addColorStop(0, '#40E0D0');
            damageGraident.addColorStop(0.5, '#FF8C00');
            damageGraident.addColorStop(1, '#ff0080');

            ctx.font = '60px IBM Plex Sans KR Medium'
            //random
            ctx.fillText(`|`, 575, 60)
            // different font
            ctx.font = '60px IBM Plex Sans KR SemiBold'
            if (i === 1) ctx.fillStyle = killGradient;
            ctx.fillText(`${new Intl.NumberFormat('ko-kr').format(leaderboards[i-1].kills)}`, 600, 60)
            ctx.font = '60px IBM Plex Sans KR Light'
            ctx.fillStyle = '#ffffff'
            ctx.fillText(`/`, 770, 60)
            // different font
            if (i === 1) ctx.fillStyle = damageGraident;
            ctx.font = '60px IBM Plex Sans KR SemiBold'
            ctx.fillText(`${new Intl.NumberFormat('ko-kr').format(leaderboards[i-1].damage)}`, 800, 60)

            body = (await request(interaction.user.displayAvatarURL({extension: 'jpg'}))).body;
            displayAvatar = await Canvas.loadImage(await body.arrayBuffer());

            // display avatar image as circle
            ctx.beginPath();
            ctx.arc(190, 40, 30, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(displayAvatar, 160, 10, 60, 60);

            // text for username same font

            await interaction.channel.send({
                files: [
                    new AttachmentBuilder(await canvas.encode('png'), {name: "value.png"})
                ]
            })


        }

    }
}
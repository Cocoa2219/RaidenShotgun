import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonStyle,
    InteractionCollector,
    InteractionType,
    TextInputComponent,
    SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} from "discord.js";
import pkg from "discord.js"; // Import the 'discord.js' package as a whole
const { EmbedBuilder } = pkg;// Access the MessageEmbed class from the package
import User from "../schemas/user.js";
import mongoose from "mongoose";
import {GenshinRegion} from "hoyoapi";

export default {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("유저 등록"),
    async execute(client, interaction) {


        User.findOne({user: interaction.user.tag}).then(async (docs) => {
            if (docs !== null) {
                interaction.reply({content: '이미 등록이 되어 있네.', ephemeral: true})
            } else {
                const inputButton = new ButtonBuilder()
                    .setCustomId('input')
                    .setLabel('붙여넣기')
                    .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder()
                    .addComponents(inputButton)

                const response = await interaction.reply({
                    content: "이 절차는 아주 중요한 절차야.\n" +
                        "이 절차를 통해서 너는 앞으로 나를 통해서 호요랩의 정보를 찾아볼 수 있어.\n" +
                        "1. <https://www.hoyolab.com/>에 크롬을 사용해 들어가서 로그인 해.\n" +
                        "2. F12를 눌러 개발자 창을 열고 콘솔(또는 Console)을 클릭해.\n" +
                        "3. 아래 코드를 입력해줘.\n" +
                        "`document.write(document.cookie)`\n" +
                        "4. 화면에 나오는 긴 글을 Ctrl+C해.**(⚠️ 주의: 그 긴 글을 아무에게나 보내면 너의 호요랩 계정이 날아가버릴수도 있으니 조심해. [더 자세한 정보는 여기]())** \n" +
                        "5. 아래 버튼을 누르고 붙여 넣기해줘."
                    , components: [row], ephemeral: true
                })

                const inputFilter = i => i.user.id === interaction.user.id;

                const inputCollector = response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60_000,
                    filter: inputFilter
                })

                inputCollector.on('collect', async (i) => {
                    const inputFields = {
                        cookie: new TextInputBuilder()
                            .setCustomId('cookie')
                            .setLabel('쿠키 붙여넣기')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true),
                        uid: new TextInputBuilder()
                            .setCustomId('uid')
                            .setLabel('UID')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true),

                    }

                    const inputModal = new ModalBuilder()
                        .setCustomId('inputModal')
                        .setTitle('쿠키 붙여넣기')
                        .setComponents(
                            new ActionRowBuilder().addComponents(inputFields.cookie),
                            new ActionRowBuilder().addComponents(inputFields.uid),
                        )

                    await i.showModal(inputModal)

                    const submittedModal = await i.awaitModalSubmit({
                        time: 60_000,
                        filter: interact => interact.user.id === i.user.id
                    })
                        .then(async submitInteraction => {
                            const cookie = submitInteraction.fields.getTextInputValue("cookie")
                            const uid = submitInteraction.fields.getTextInputValue("uid")
                            const ltuidRegex = /ltuid_v2=(\d{9})/
                            const ltokenRegex = /ltoken_v2=(.*);/
                            const ltuidMatch = ltuidRegex.exec(cookie);
                            const ltokenMatch = ltokenRegex.exec(cookie);
                            let ltuid;
                            let ltoken;

                            if (ltuidMatch) {
                                ltuid = ltuidMatch[1];
                                if (ltokenMatch) {
                                    ltoken = ltokenMatch[1];
                                    if (uid.length === 9) {
                                        let user;
                                        submitInteraction.reply({
                                            content: `ltuid: ${ltuid}, ltoken: ${ltoken}, UID: ${uid}로 등록을 마쳤어.`,
                                            ephemeral: true
                                        })
                                        user = await new User({
                                            _id: new mongoose.Types.ObjectId(),
                                            user: interaction.user.tag,
                                            ltuid: ltuid,
                                            ltoken: ltoken,
                                            uid: uid,
                                            region: GenshinRegion.EUROPE
                                        })

                                        await user.save();
                                    } else {
                                        submitInteraction.reply({content: "UID에 문제가 있는 것 같은데..?", ephemeral: true})
                                    }
                                } else {
                                    submitInteraction.reply({content: "쿠키에 문제가 있는 것 같은데..?", ephemeral: true})
                                }
                            } else {
                                submitInteraction.reply({content: "쿠키에 문제가 있는 것 같은데..?", ephemeral: true})
                            }

                        })
                        .catch(error => {
                            console.log(error)
                            i.editReply({content: "1분이 지나 제출을 비활성화했어.", components: []})
                        })
                })
                inputCollector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.editReply({content: "1분이 지나 버튼을 비활성화했어.", components: []})
                    }
                })
            }
        })

        /*
        const user = await new User({
            _id: new mongoose.Types.ObjectId(),
            user: interaction.user.tag,
            ltuid: "",
            ltoken: "",
            uid: ""
        })

        await user.save();
        */
    }
};

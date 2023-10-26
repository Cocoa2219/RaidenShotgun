import { ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, InteractionCollector, InteractionType, TextInputComponent } from "discord.js";
import pkg from "discord.js"; // Import the 'discord.js' package as a whole
const { EmbedBuilder } = pkg;// Access the MessageEmbed class from the package
import User from "../schemas/user.js";
import mongoose from "mongoose";

export default {
    data: new SlashCommandBuilder()
        .setName("unregister")
        .setDescription("유저 등록 해제"),
    async execute(client, interaction) {
        await (async () => {
            mongoose.set("strictQuery", false);
            await mongoose
                .connect("mongodb+srv://cocoa:1234@raidenshogun.bvynira.mongodb.net", {dbName: "RaidenShogun"})
                .catch(console.error);
        })();
        User.find({user: interaction.user.tag}).then(async (docs) => {
            if (docs.length !== 0) {
                const unregisterButton = new ButtonBuilder()
                    .setCustomId('unregister')
                    .setLabel('등록 해제하기')
                    .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder()
                    .addComponents(unregisterButton)

                const response = await interaction.reply({
                    content: "진짜로 등록 해제할 거야? 다시 등록 할 수도 있어.",
                    components: [row],
                    ephemeral: true
                })

                const unregisterFilter = i => i.user.id === interaction.user.id;

                const unregisterCollector = response.createMessageComponentCollector({ componentType : ComponentType.Button, time:60_000, filter: unregisterFilter})

                unregisterCollector.on('collect', async (unregisterInteraction) => {
                    User.deleteMany({ user: interaction.user.tag }).then((result) => {
                        console.log(result)
                    });
                    await interaction.editReply({content: `사용자 ${interaction.user.tag}를 등록 해제했어.`, ephemeral: true})
                })
                unregisterCollector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.editReply({ content: "1분이 지나 버튼을 비활성화했어.", components: []})
                    }
                })

            } else {
                interaction.reply({content: "미안하지만 너와 관련된 계정을 찾을 수 없어.", ephemeral: true})
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

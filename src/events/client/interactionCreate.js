module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      await interaction.reply({
        content: "커맨드를 실행하는 데 문제가 좀 있었어.",
        ephemeral: true,
      });
    }
  },
};

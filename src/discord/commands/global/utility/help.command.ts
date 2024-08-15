import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import commands from "discord/index.commads";

export = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription('Все доступные команды !'),
    async execute(interaction: CommandInteraction) {
        return await interaction.reply({ content: `Все команды: \n🎩${commands.join('\n🎩')}`, ephemeral: true });
    }
};
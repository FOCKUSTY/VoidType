import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Commands from "discord/index.commands";

export = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription('Все доступные команды !'),
    async execute(interaction: CommandInteraction) {
        return await interaction.reply({ content: `Все команды: \n🎩${Commands.commands.join('\n')}`, ephemeral: true });
    }
};
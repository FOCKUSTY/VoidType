import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getCommands } from "d@utility/commandsList";

export =
{
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription('Все доступные команды !'),
    async execute(interaction: any)
    {
        const commands = getCommands();

        await interaction.reply({
            ephemeral: true,
            content: `${commands.join('\n')}`
        });
    }
};
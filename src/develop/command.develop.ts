import type { CommandInteraction } from "discord.js";

export class DevelopCommand {
    public static execute = async (interaction: CommandInteraction) => {
        return await interaction.reply({ content: 'Эта команда находится в разработке', ephemeral: true });
    }
};
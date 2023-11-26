import { CommandInteraction, Client, ApplicationCommandType, Sticker, SlashCommandBuilder } from "discord.js";
import { Command } from "../Command";

export = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription('Все доступные команды !'),
    async execute(interaction: CommandInteraction) {

        const hat: string = ':tophat:'

        const commands: string[] = [
            `${hat} /help`,
            `${hat} /thevoid`,
            `${hat} /ping`,
            `${hat} /random`,
            `${hat} /test`,
            `${hat} /user`,
        ]

        await interaction.reply({
            ephemeral: true,
            content: `${commands.join('\n')}`
        });
    }
}
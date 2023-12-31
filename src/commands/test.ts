import { CommandInteraction, Client, ApplicationCommandType, SlashCommandBuilder, InteractionReplyOptions, Interaction, EmbedBuilder } from "discord.js";
import { Command } from "../Command";

export = {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Тестовое сообщение !"),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            content: 'Test message?...',
            fetchReply: true,
            ephemeral: true
        });
    }
};
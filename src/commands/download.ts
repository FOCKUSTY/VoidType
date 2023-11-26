import { CommandInteraction, Client, ApplicationCommandType, SlashCommandBuilder, InteractionReplyOptions, Interaction, EmbedBuilder } from "discord.js";
import { Command } from "../Command";

export = {
    name: "download",
    description: "Не работающая команда !",
    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            content: 'Test message?...',
            fetchReply: true,
            ephemeral: true
        });
    }
};
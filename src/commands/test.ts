import { CommandInteraction, Client, ApplicationCommandType, InteractionReplyOptions, Interaction, EmbedBuilder } from "discord.js";
import { Command } from "../Command";

export const test: Command = {
    name: "test",
    description: "Тестовое сообщение !",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {

        await interaction.reply({ content: 'Test message?...', fetchReply: true, ephemeral: true});
    }
};
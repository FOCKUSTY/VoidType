import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export =
{
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Тестовое сообщение !"),
    async execute(interaction: CommandInteraction)
    {
        return await interaction.reply({
            content: 'Test message?...',
            fetchReply: true, ephemeral: true
        });
    }
};
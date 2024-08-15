import Sleep from "utility/service/sleep.service";
import type { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { config } from "config";

export =
{
    data: new SlashCommandBuilder()
    .setName("sleep")
    .setDescription("Усыпить бота !"),
    async execute(interaction: CommandInteraction) {
        if(interaction.user.id !== config.authorId)
            return await interaction.reply({ content: 'Ты не мой создатель', ephemeral: true });

        await Sleep.execute(interaction.client);

        return await interaction.reply({ content: 'I\'m sleep...', ephemeral: true });
    }
};
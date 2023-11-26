import { CommandInteraction, SlashCommandBuilder, Client, ApplicationCommandType, InteractionReplyOptions, Interaction } from "discord.js";
import { Command } from "../Command";

export = {
    data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Убить бота !"),
    async execute(interaction: CommandInteraction) {
        const cl: Client = interaction.client

        if(interaction.user.id === `877154902244216852`) {
            await interaction.reply({
            content: `Бот завершил работу!`,
            ephemeral: true
        })

        console.log(`Бот сбит...`)
            await cl.destroy();
            setTimeout(() => {
                process.exit()}, 1000)
        } else {
            console.log(`Error: Недостаточно прав`)
            await interaction.reply({
                content: `У Вас недостаточно прав`,
                ephemeral: true
            })
        };
    }
};
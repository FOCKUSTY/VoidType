import { CommandInteraction, Client, ApplicationCommandType, InteractionReplyOptions, Interaction } from "discord.js";
import { Command } from "../Command";

export const kill: Command = {
    name: "kill",
    description: "Убить бота !",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
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
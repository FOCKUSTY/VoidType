import { CommandInteraction, Client, ApplicationCommandType, InteractionReplyOptions, Interaction } from "discord.js";
import { Command } from "../Command";

export const ping: Command = {
    name: "ping",
    description: "Вовращает понг !",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {

        const sent = await interaction.reply({ content: '# Pong ! :tophat:\n Считаем время...', fetchReply: true, ephemeral: true});

        let awaitSecond: number = Math.round((sent.createdTimestamp - interaction.createdTimestamp) / 1000 * Math.pow(10, 1)) / Math.pow(10, 1);
        
        await interaction.editReply({
            content: `# Pong ! :tophat:\n- Задержка бота: \n - ${sent.createdTimestamp - interaction.createdTimestamp}ms\n - ${awaitSecond}s`})

    }
};
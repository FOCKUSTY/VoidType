import { CommandInteraction, Client, ApplicationCommandType, Sticker } from "discord.js";
import { Command } from "../Command";
import { Commands } from "../SlashCommands";

export const help: Command = {
    name: "help",
    description: "Все доступные команды !",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const commands: string[] = [];
        Commands.forEach((e) => {
            commands.push(`:tophat: ${e.name}`)
        })

        await interaction.reply({
            ephemeral: true,
            content: `${commands.join(`\n`)}`
        });
    }
};
import { CommandInteraction, ChatInputApplicationCommandData, ApplicationCommandSubCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}
import { ChatInputApplicationCommandData, SlashCommandBuilder, Interaction } from 'discord.js'
import { commands } from '../SlashCommands';

export async function intCreate(commands: any, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName) as {
        execute: (interaction: Interaction) => Promise<void>;
    };

    if (!command)
    return console.error(
        `No command matching ${interaction.commandName} was found.`
    );

try {
    await command.execute(interaction);
} catch (error) {
    await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
    });
}
}
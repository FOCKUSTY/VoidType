import { REST, Routes } from "discord.js";
import { config } from "./config";
import { Commands } from "./SlashCommands";

const commandsData = Object.values(Commands).map((command) => command);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
    console.log("Начало обновления (/) команд");

    await rest.put(
        Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
        {
        body: commandsData,
        }
    );

    console.log("(/) команды успешно обновлены");
    } catch (error) {
    console.error(error);
    }
}
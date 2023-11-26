import { Command } from "./Command";
import { REST, Routes, SlashCommandBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";

export const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const filesPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(filesPath).filter(file => file.endsWith('.ts'));

(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(`${filesPath}\\${file}`)
        const command = await require(filePath)
        if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			if(filePath==='D:\\VoidBotTs\\src\\commands\\download.ts') continue;
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
    }
})();

const rest = new REST({ version: "9" }).setToken(config.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Начало обновления (/) команд`);

		await rest
            .put(
			Routes.applicationCommands(config.DISCORD_CLIENT_ID),
			{ body: commands },
		)
		console.log(`Успешно обновлены (/) команды`);
	} catch (error) {
		console.error(error);
		return;
	}
})();
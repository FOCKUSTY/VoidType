import { Command } from "./Command";
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";

export const commands: Command[] = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command)
		{
			commands.push(command.data.toJSON());
		}
		else
		if(!(filePath==='F:\\VoidBotTs\\src\\commands\\utility\\download.ts'))
		{
		  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async () =>
{
	try
	{
		console.log(`Начало обновления ${commands.length} (/) команд.`);

		await rest.put(
			Routes.applicationCommands(config.DISCORD_CLIENT_ID),
			{ body: commands },
		);
	}
	catch (err)
	{
		console.error(err);
	}
})();
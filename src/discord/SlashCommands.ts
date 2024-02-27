import { Command } from "./Command";
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from "./config";
import { deployCommands, updateCommands } from './utils/delpoyCommands'


const guildId = '1169284741846016061';
export const globalCommands: Command[] = [];
const globalFoldersPath = path.join(__dirname, 'globalCommands');
const globalCommandFolders = fs.readdirSync(globalFoldersPath);

export const guildCommands: Command[] = [];
const guildFoldersPath = path.join(__dirname, 'guildCommands');
const guildCommandFolders = fs.readdirSync(guildFoldersPath);

deployCommands(globalCommandFolders, globalCommands, globalFoldersPath);
deployCommands(guildCommandFolders, guildCommands, guildFoldersPath);

/* for (const folder of globalCommandFolders)
{
	const commandsPath = path.join(globalFoldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	if (commandFiles.length === 0) commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command)
		{
			globalCommands.push(command.data.toJSON());
		}
		else if(!(filePath==='F:\\VoidBotTs\\src\\globalCommands\\utility\\download.ts'))
		{
		  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const folder of guildCommandFolders)
{
	const commandsPath = path.join(guildFoldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	if (commandFiles.length === 0) commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command)
		{
			globalCommands.push(command.data.toJSON());
		}
		else if(!(filePath==='F:\\VoidBotTs\\src\\commands\\utility\\download.ts'))
		{
		  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
} */

const rest = new REST().setToken(config.DISCORD_TOKEN);

updateCommands(rest, globalCommands, config.DISCORD_CLIENT_ID, 'global');
updateCommands(rest, guildCommands, config.DISCORD_CLIENT_ID, 'guild');

/* (async () =>
{
	try
	{
		console.log(`Начало обновления ${globalCommands.length} (/) глобальных команд`);

		await rest.put(
			Routes.applicationCommands(config.DISCORD_CLIENT_ID),
			{ body: globalCommands },
		);
	}
	catch (err)
	{
		console.error(err);
	}
})();

(async () =>
{
	try
	{
		console.log(`Начало обновления ${guildCommands.length} (/) команд гильдии`);

		await rest.put(
			Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
			{ body: guildCommands },
		);
	}
	catch (err)
	{
		console.error(err);
	}
})(); */

/* updateCommands(rest, globalCommands, config.DISCORD_CLIENT_ID, 'global');
updateCommands(rest, guildCommands, config.DISCORD_CLIENT_ID, 'guild'); */

/* for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	if (commandFiles.length === 0) commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command)
		{
			commands.push(command.data.toJSON());
		}
		else if(!(filePath==='F:\\VoidBotTs\\src\\commands\\utility\\download.ts'))
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
})(); */
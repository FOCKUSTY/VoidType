import { REST, Routes } from 'discord.js';

import { deployCommands, updateCommands } from 'd@utility/deployCommands';
import { Command } from "d@command";
import { config } from 'd@config';

import fs from 'node:fs';
import path from 'node:path';

const guildId: any = config.guildId;

export const globalCommands: Command[] = [];
const globalFoldersPath = path.join(__dirname, 'globalCommands');
const globalCommandFolders = fs.readdirSync(globalFoldersPath);

export const guildCommands: Command[] = [];
const guildFoldersPath = path.join(__dirname, 'guildCommands');
const guildCommandFolders = fs.readdirSync(guildFoldersPath);

deployCommands(globalCommandFolders, globalCommands, globalFoldersPath);
deployCommands(guildCommandFolders, guildCommands, guildFoldersPath);

const rest = new REST().setToken(config.token);

updateCommands(rest, globalCommands, config.clientId, 'global');
updateCommands(rest, guildCommands, config.clientId, 'guild');
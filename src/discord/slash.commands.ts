import { DeployCommands, UpdateCommands } from './deploy.commands';
import { Command } from "./command.commands";

import path from 'path';
import fs from 'fs';

const globalCommands: Command[] = [];
const guildCommands: Command[] = [];

const foldersPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(foldersPath);

DeployCommands(globalCommands, 'global', foldersPath, commandsFolder);
DeployCommands(guildCommands, 'guild', foldersPath, commandsFolder);

UpdateCommands(globalCommands, 'global');
UpdateCommands(guildCommands, 'guild');

export = {
    global: globalCommands,
    guild: guildCommands,
};
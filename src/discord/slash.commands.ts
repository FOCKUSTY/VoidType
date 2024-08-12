import { DeployCommands, UpdateCommands } from './deploy.commands';
import { Command } from "./command.commands";

const globalCommands: Command[] = [];
const guildCommands: Command[] = [];

DeployCommands(globalCommands, 'global');
DeployCommands(guildCommands, 'guild');

UpdateCommands(globalCommands, 'global');
UpdateCommands(guildCommands, 'guild');

export = {
    global: globalCommands,
    guild: guildCommands,
};
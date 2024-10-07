import type { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";
import Commands from 'telegram/index.commands';
import Logger from 'fock-logger';

import path from "node:path";

const CommandsLogger = new Logger('Commands').execute;
const FailLogger = new Logger('Fail').execute;

export const commands = new Map<string, { execute: (interaction: Interaction) => any, options: any[] }>();

export const DeployCommands = (Client: Telegraf, commandsPath: string, commandsFiles: string[]) => {
    for (const fileName of commandsFiles) {
        const filePath = path.join(commandsPath, fileName);
        const command: {
            name: string | undefined,
            options: any
            execute: (interaction: Interaction) => any
        } = require(filePath);

        CommandsLogger(`Telegram команда ${command.name}`);
        
        if(command.execute && command.name)
        {
            commands.set(command.name, {
                execute: command.execute,
                options: command.options || undefined
            });

            Commands.commands = command.name;
            Client.command(command.name, async (message: Interaction) => command.execute(message));
        }

        else
            FailLogger(`Потерян execute или name в ${command?.name || fileName}\nПуть: ${filePath}`); 
    };
};
import { Telegraf } from "telegraf";
import Commands from 'telegram/index.commands';
import loggers from 'logger/index.logger';

import path from "node:path";
import fs from "node:fs";
import { Interaction } from "src/types/telegram/interaction.type";

export const commands = new Map<string, { execute: (interaction: Interaction) => any, options: any[] }>();

export const DeployCommands = (Client: Telegraf, commandsPath: string, commandsFiles: string[]) => {
    for (const fileName of commandsFiles) {
        const filePath = path.join(commandsPath, fileName);
        const command: {
            name: string | undefined,
            options: any
            execute: (interaction: Interaction) => any
        } = require(filePath);

        loggers.Commands.execute(`Telegram команда ${command.name}`);
        
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
            loggers.Fail.execute(`Потерян execute или name в ${command?.name || fileName}\nПуть: ${filePath}`); 
    };
};
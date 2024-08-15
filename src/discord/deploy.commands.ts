import { config } from 'config';
import { REST, Routes } from 'discord.js';
import { Command } from './command.commands';
import { Debug } from 'develop/debug.develop';

import type {
    Client as DiscordClient,
    Collection as CommandsCollection
} from 'discord.js';

import fs from 'node:fs';
import path from 'node:path';
import loggers from 'logger/index.logger';
import { Colors } from 'utility/service/formatter.service';

let using = 0;

export const WriteCommands = (
    Commands: CommandsCollection<any, any>,
    Client: DiscordClient,
    foldersPath: string,
    commandsFolder: string[],
    type?: 'global'|'guild'
) => {
    for(const placeFolder of commandsFolder)
    {
        const commandsPath = path.join(foldersPath, placeFolder);
        const commands = fs.readdirSync(commandsPath);

        if(placeFolder !== type && !!type)
            continue;

        for(const folder of commands)
        {
            const modifierPath = path.join(commandsPath, folder);
            const files = fs.readdirSync(modifierPath)
                .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));
        
            for(const file of files)
            {
                const filePath = path.join(modifierPath, file);
                const command: any = require(filePath);

                if('data' in command && 'execute' in command)
                {
                    const options = command.data.options;
                    const name = command.data.name;

                    let subcommands = [];
                    let spaces = '';
                    let text = `Команда ${command.data.name}`;

                    if(options.length !== 0)
                    {
                        text = `Команда ${command.data.name}`

                        for(let i = 0; i < (15 - name.length-1); i++)
                            spaces += ' ';
                        
                        subcommands.push(`${spaces} Опции:`);
                        
                        for(let key in command.data.options)
                        {
                            using += 1;
                            subcommands.push(`${options[key].name}`);
                            
                            if(using <= options.length-1)
                                subcommands.push("|");
                        };

                        using = 0;
                    };

                    Commands.set(command.data.name, command);
                    
                    Client.application?.commands.set(command.data.name, command);
                
                    subcommands.unshift(text);
                    
                    if(subcommands.length != 0)
                        loggers.Commands.execute(`${subcommands.join(' ')}`);
                }
                else
                {
                    Debug.Error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                };
            };
        };
    };
};

export const DeployCommands = (Commands: Command[], type: 'global'|'guild', foldersPath: string, commandsFolder: string[]) => {
    for(const placeFolder of commandsFolder)
    {
        const commandsPath = path.join(foldersPath, placeFolder);
        const commands = fs.readdirSync(commandsPath);

        if(placeFolder !== type)
            continue;

        for(const folder of commands)
        {
            const modifierPath = path.join(commandsPath, folder);
            const files = fs.readdirSync(modifierPath)
                .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));
        
            for(const file of files)
            {
                const filePath = path.join(modifierPath, file);
                const command: any = require(filePath);

                if('data' in command && 'execute' in command)
                    Commands.push(command.data.toJSON());
                else
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            };
        };
    };
};

const rest = new REST().setToken(config.clientToken);

export const UpdateCommands = async (commands: any, type: 'global'|'guild') => {
    try {
        if(type === 'global')
        {
            loggers.Updater.execute('Начало обновления глобальных (/) команд');
            
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands },
            )
            
            loggers.Updater.execute('Успешно обновлены глобальные (/) команды', Colors.green);
        }
        else
        {
            loggers.Updater.execute('Начало обновления (/) команд гильдии');

            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands },
            );
            
            loggers.Updater.execute('Успешно обновлены (/) команды гильдии', Colors.green);
        };
    }
    catch (error) {
        Debug.Error(error);
        return;
    };
};
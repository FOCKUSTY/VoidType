import { config } from 'config';
import { REST, Routes } from 'discord.js';
import { Command } from './command.commands';
import { Debug } from 'develop/debug.develop';
import { Colors } from 'utility/service/formatter.service';
import Logger from 'logger/index.logger';

import type {
    Client as DiscordClient,
    Collection as CommandsCollection
} from 'discord.js';

import fs from 'node:fs';
import path from 'node:path';

let using = 0;

const Updater = new Logger('Updater').execute;
const CommandsLogger = new Logger('Commands').execute;

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
            const files = fs
                .readdirSync(modifierPath)
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
                        CommandsLogger(`${subcommands.join(' ')}`);
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
            Updater('Начало обновления глобальных (/) команд');
            
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands },
            )
            
            Updater('Успешно обновлены глобальные (/) команды', Colors.green);
        }
        else
        {
            Updater('Начало обновления (/) команд гильдии');

            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands },
            );
            
            Updater('Успешно обновлены (/) команды гильдии', Colors.green);
        };
    }
    catch (error) {
        Debug.Error(error);
        return;
    };
};
import { config } from 'config';
import { REST, Routes } from 'discord.js';
import { Debug } from 'develop/debug.develop';
import Logger, { Colors } from 'fock-logger';

import type {
    Client as DiscordClient,
    Collection as CommandsCollection
} from 'discord.js';

import fs from 'node:fs';
import path from 'node:path';

let using = 0;

class Deployer {
    private readonly _folders_path: string;
    private readonly _commands_folder: string[];

    private readonly _logger: Logger<'Commands'> = new Logger('Commands');
    private readonly _updater: Logger<'Updater'> = new Logger('Updater');
    private readonly _rest: REST = new REST().setToken(config.clientToken);

    constructor(
        foldersPath: string,
        commandsFolder: string[],
    ) {
        this._folders_path = foldersPath;
        this._commands_folder = commandsFolder;
    };

    private readonly ForeachFolders = (func: (...args: any) => any, type?: 'guild'|'global') => {
        for(const placeFolder of this._commands_folder) {
            const commandsPath = path.join(this._folders_path, placeFolder);
            const commands = fs.readdirSync(commandsPath);

            if(placeFolder !== type && !!type)
                continue;

            for(const folder of commands) {
                const modifierPath = path.join(commandsPath, folder);
                const files = fs.readdirSync(modifierPath)
                    .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

                for(const file of files) {
                    func(file, modifierPath, folder, commandsPath);
                };
            };
        };
    };

    public readonly write = (Client: DiscordClient, Commands: CommandsCollection<any, any>, type?: 'guild'|'global') => {
        this.ForeachFolders((file, modifierPath) => {
            const filePath = path.join(modifierPath, file);
            const command: any = require(filePath);

            if('data' in command && 'execute' in command) {
                const options = command.data.options;
                const name = command.data.name;

                let subcommands = [];
                let spaces = '';
                let text = `Команда ${command.data.name}`;

                if(options.length !== 0) {
                    text = `Команда ${command.data.name}`

                    for(let i = 0; i < (15 - name.length-1); i++)
                        spaces += ' ';
                    
                    subcommands.push(`${spaces} Опции:`);
                    
                    for(let key in command.data.options) {
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
                    this._logger.execute(`${subcommands.join(' ')}`);
            }
            else {
                Debug.Error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            };
        }, type);
    };

    public readonly update = async (commands: any, type: 'guild'|'global') => {
        try {
            if(type === 'global') {
                this._updater.execute('Начало обновления глобальных (/) команд');
                
                await this._rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commands },
                )
                
                this._updater.execute('Успешно обновлены глобальные (/) команды', Colors.green);
            }
            else {
                this._updater.execute('Начало обновления (/) команд гильдии');
    
                await this._rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commands },
                );
                
                this._updater.execute('Успешно обновлены (/) команды гильдии', Colors.green);
            };
        }
        catch (err) {
            return Debug.Error(err);
        };
    };

    public readonly execute = (Commands: any[], type: 'guild'|'global') => {
        this.ForeachFolders((file, modifierPath) => {
            const filePath = path.join(modifierPath, file);
            const command: any = require(filePath);

            if('data' in command && 'execute' in command)
                Commands.push(command.data.toJSON());
            else
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }, type);
    };
};

export default Deployer;
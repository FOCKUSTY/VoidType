import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const guildId = '1169284741846016061';

let using = 0;

export const indexDeployCommands = (commandFolders: any, foldersPath: any, client: any, commands: any) =>
{
    for (const folder of commandFolders)
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
                const options = command.data.options;
                const name = command.data.name;
                let subcommands = [];
                let spaces = '';
                let text = `Команда ${command.data.name}`;
                if(options.length!=0)
                {
                    text = `Команда ${command.data.name}`
                    for(let i=0; i<12 - name.length-1; i++) spaces += ' ';
                    subcommands.push(`${spaces} Опции:`);
                    for(let key in command.data.options)
                    {
                        using+=1
                        subcommands.push(`${options[key].name}`);
                        if(using <= options.length-1) subcommands.push("|");
                    };
                    using = 0;
                };
                
                commands.set(command.data.name, command);
                client?.application?.commands.set(command.data.name, command);

                subcommands.unshift(text);
                if(subcommands.length!=0) console.log(`${subcommands.join(' ')}`);
            }
            else
            {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            };
        };
    };
};

export const deployCommands = (commandFolders: any, commands: any, foldersPath: any) =>
{
    for (const folder of commandFolders)
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
            else
            {
                if(!(filePath==='F:\\VoidBotTs\\src\\commands\\utility\\download.ts')) console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            };
        };
    };
};

export const updateCommands = async (rest: any, commands: any, clientId: string, type='global') =>
{
        try
        {
            if(type==='global')
            {
                console.log(`Начало обновления ${commands.length} (/) глобальных команд`);
                
                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                )
                
                console.log(`Успешно обновлены глобальных(ые) (/) команд(ы)`);
            }
            else
            {
                console.log(`Начало обновления ${commands.length} (/) команд(ы) гильдии`);

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                )
                
                console.log(`Успешно обновлены (/) команд(ы) гильдии`);
            }

        }
        catch (error)
        {
            console.error(error);
            return;
        }
}
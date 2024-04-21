import fs from 'node:fs';
import path from 'node:path';

const globalFoldersPath = path.join(__dirname, 'commands');
const globalCommandFolders = fs.readdirSync(globalFoldersPath);

const commands = new Map();

const deployCommands = (client: any, commandFolders=globalCommandFolders, foldersPath=globalFoldersPath) =>
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
    
            if('execute' in command && 'name' in command)
            {
                console.log(`Telegram команда: ${command.name}`);

                if(!command.options) commands.set(command.name, command.execute);
                else commands.set(command.name, [command.execute, command.options]);

                client.command(command.name, async (message: any) => command.execute(message));
            }
            else console.error(`Потерян 'execute' или 'name' в ${command?.name || 'Имени нет'}\nПуть: ${filePath}`); 
        };
    };
};

export
{
    deployCommands,
    commands
}
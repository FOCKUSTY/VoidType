import { Client } from 'discord.js';
import { debug } from './developConsole';
import path from "path";

const deployEvents = (eventsPath: string, eventFiles: string[], client: Client) =>
{
    console.log();
    
    for (const file of eventFiles)
        {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
        
            debug([`Загружаю прослушиватель: ${event.name}`, '->', file], true, false, false);

            if(event.once)
                client.once(event.name, (...args) => event.execute(...args));
            
            else if(event.execute)
                client.on(event.name, (...args) => event.execute(...args));
        };
};

export
{
    deployEvents
};
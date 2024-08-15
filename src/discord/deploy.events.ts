import type { Client as DiscordClient } from 'discord.js';

import path from "node:path";
import fs from "node:fs";
import loggers from 'logger/index.logger';

export const DeployEvents = (Client: DiscordClient, eventsPath: string, eventFiles: string[]) => {
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
    
        loggers.Events.execute(`Загрузка прослушивателя ${event.name}`);

        if(event.once)
            Client.once(event.name, (...args) => event.execute(...args));
        
        else if(event.execute)
            Client.on(event.name, (...args) => event.execute(...args));
    };
};
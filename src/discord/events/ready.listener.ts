import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import ClientLoader from "loaders/client.loader";
import { RandomActiviy } from "service/random-activity.service";

import ActivityLoader from 'loaders/activities.loader';
import ObjectsLoader from 'loaders/objects.loader';
import loggers from "logger/index.logger";

export = {
	name: Events.ClientReady,
	once: true,
	async execute(Client: DiscordClient) {
        if(!Client.user)
            return;

        Client.user.setPresence({ activities: [{ name: 'The Void Community' }], status: 'idle' });

        ActivityLoader();
        ObjectsLoader();

        ClientLoader.execute(Client);
        RandomActiviy(Client);

        setInterval(() => {
            RandomActiviy(Client);
        }, 60000);

        loggers.TheVoid.execute('Начинаю работу');
    }
};
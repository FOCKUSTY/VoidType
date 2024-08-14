import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import ClientLoader from "utility/loaders/client.loader";
import { RandomActiviy } from "utility/service/random-activity.service";

import ActivityLoader from 'utility/loaders/activities.loader';
import ObjectsLoader from 'utility/loaders/objects.loader';
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
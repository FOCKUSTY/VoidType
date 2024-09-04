import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import ClientLoader from "utility/loaders/client.loader";
import RandomActiviy from "utility/service/random-activity.service";

import ActivityLoader from 'utility/loaders/activities.loader';
import Logger from "logger/index.logger";

export = {
	name: Events.ClientReady,
	once: true,
	async execute(Client: DiscordClient) {
        if(!Client.user)
            return;

        const randomActivity = new RandomActiviy(Client);

        Client.user.setPresence({ activities: [{ name: 'The Void Community' }], status: 'idle' });

        new ActivityLoader().execute();
        new ClientLoader().execute(Client);

        randomActivity.execute();

        setInterval(() => {
            randomActivity.execute();
        }, 60000);

        new Logger('TheVoid').execute('Начинаю работу');
    }
};
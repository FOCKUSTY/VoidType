import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import { ActivityTypes } from "types/activities/activities.enum";
import Logger from "logger/index.logger";

import ClientLoader from "utility/loaders/client.loader";
import ActivityLoader from 'utility/loaders/activities.loader';
import RandomActiviy from "utility/service/random-activity.service";

export = {
	name: Events.ClientReady,
	once: true,
	async execute(Client: DiscordClient) {
        if(!Client.user)
            return;

        const randomActivity = new RandomActiviy(Client, process.env.NODE_ENV === 'dev' ? 'dev' : '');
        const acitivyLoader = new ActivityLoader();

        Client.user.setPresence({ activities: [{
            name: process.env.NODE_ENV === 'dev'
                ? 'Запущено в режиме разработки!'
                : 'Запущено в режиме итогов!', type: Number(ActivityTypes.custom)
        }], status: 'idle' });

        acitivyLoader.execute();
        new ClientLoader().execute(Client);

        randomActivity.execute();
        
        setInterval(() => {
            randomActivity.execute();
        }, 60_000);

        setInterval(() => {
            acitivyLoader.reload();
        }, 60_0000);

        new Logger('TheVoid').execute('Начинаю работу');
    }
};
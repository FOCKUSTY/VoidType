import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import { ActivityTypes } from "types/activities/activities.enum";
import Logger from "fock-logger";

import ClientLoader from "utility/loaders/client.loader";
import { loaders } from "@thevoid";

import RandomActiviy from "utility/service/random-activity.service";

const { ActivitiesLoader } = loaders;

export = {
	name: Events.ClientReady,
	once: true,
	async execute(Client: DiscordClient) {
		if (!Client.user) return;

		const randomActivity = new RandomActiviy(
			Client,
			process.env.NODE_ENV === "dev" ? "dev" : ""
		);
		const activiesLoader = new ActivitiesLoader();

		Client.user.setPresence({
			activities: [
				{
					name:
						process.env.NODE_ENV === "dev"
							? "Запущено в режиме разработки!"
							: "Запущено в режиме итогов!",
					type: Number(ActivityTypes.custom)
				}
			],
			status: "idle"
		});

		activiesLoader.execute();
		new ClientLoader().execute(Client);

		setInterval(
			() => {
				randomActivity.execute();
			},
			1000 * 60 * 1
		);

		setInterval(
			() => {
				activiesLoader.reload();
			},
			1000 * 60 * 10
		);

		new Logger("TheVoid").execute("Начинаю работу");
	}
};

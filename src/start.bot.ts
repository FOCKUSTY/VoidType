import { Constants } from "@thevoidcommunity/the-void-database";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import { THEVOIDs_CONSTANTS } from "src/index.constants";
import { Debug } from "develop/debug.develop";
import { LoginDiscord } from "./discord.bot";
import { LoginTelegram } from "./telegram.bot";

import loggers from "./loggers.names";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = process.env.BOT || "discord";

new Constants(THEVOIDs_CONSTANTS).execute();

for (const name in loggers) {
	const logger = loggers[name];

	new Logger(name, logger.colors).execute(`Hello, I'm ${name}!`);
}

(async () => {
	switch (bot) {
		case "discord":
			LoginDiscord();
			break;

		case "telegram":
			LoginTelegram();
			break;

		default:
			LoginDiscord();
			LoginTelegram();
			break;
	}
})();

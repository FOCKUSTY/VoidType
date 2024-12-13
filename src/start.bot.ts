import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "develop/debug.develop";

import { LoginDiscord } from "./discord.bot";
import { LoginTelegram } from "./telegram.bot";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = process.env.BOT || "discord";

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

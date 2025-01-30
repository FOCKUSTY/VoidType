import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "@voidy/develop/dist/debug.develop";

import { LoginDiscord } from "@voidy/discord/dist/src/discord.bot";
import { LoginTelegram } from "@voidy/telegram/dist/telegram.bot";

import Llama from "utility/llama.ai";
import DiscordService from "@voidy/discord/dist/src/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = process.env.BOT || "discord";

for (const name in loggers) {
	const logger = loggers[name];

	new Logger(name, { colors: logger.colors }).execute(`Hello, I'm ${name}!`);
}

(async () => {
	const services = {
		discord: new DiscordService(),
		telegram: new TelegramService(),
		llama: new Llama()
	};

	switch (bot) {
		case "discord":
			LoginDiscord(`${process.env.CLIENT_TOKEN}`, services);
			break;

		case "telegram":
			LoginTelegram(services);
			break;

		default:
			LoginDiscord(`${process.env.CLIENT_TOKEN}`, services);
			LoginTelegram(services);
			break;
	}
})();

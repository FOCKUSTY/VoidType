import { Env } from "@voidy/develop/dist";

import "src/index.constants";

import Formatter, { Colors } from "f-formatter";

import Loggers from "./loggers.names";
import { Debug } from "@voidy/develop/dist/debug.service";

import { LoginDiscord } from "@voidy/discord/dist/src/discord.bot";
import { LoginTelegram } from "@voidy/telegram/dist/telegram.bot";

import Llama from "./utility/llama.ai";
import DiscordService from "@voidy/discord/dist/src/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = Env.get<false>("BOT") || "all";

new Loggers().execute();

(async () => {
	const services = {
		discord: new DiscordService(),
		telegram: new TelegramService(),
		llama: new Llama()
	};

	switch (bot) {
		case "discord":
			LoginDiscord(Env.get("CLIENT_TOKEN"), services);
			break;

		case "telegram":
			LoginTelegram(services);
			break;

		default:
			LoginDiscord(Env.get("CLIENT_TOKEN"), services);
			LoginTelegram(services);
			break;
	}
})();

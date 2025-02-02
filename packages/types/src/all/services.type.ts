import { Service as Telegram } from "../telegram/service.type";
import { Service as Discord } from "../discord/service.type";

export type Services = {
	discord: Discord;
	telegram: Telegram;
};

import { Service as Telegram } from "../telegram/service.type";
import { Service as Discord } from "../discord/service.type";

export type Services<T extends { [key: string]: unknown } = {}> = {
	discord: Discord;
	telegram: Telegram;
} & T;

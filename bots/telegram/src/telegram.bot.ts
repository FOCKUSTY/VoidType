import { config } from "dotenv";

config();

import { Telegraf } from "telegraf";

import type { Interaction } from "@voidy/types/dist/telegram/interaction.type";

import Deployer, { Props } from "./deploy.commands";

import MessageListener from "./events/message.listener";
import SlashCommandsListener from "./events/slash-commands.listener";

import path from "path";
import fs from "fs";

const Client = new Telegraf(process.env.TELEGRAM_TOKEN || "");

Client.on("message", async (message: Interaction) => {
	SlashCommandsListener(message);
	MessageListener(message);
});

const Login = async (services: Props) => {
	const commandsPath = path.join(__dirname, "telegram/commands");
	const commandsFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

	new Deployer(services).execute(Client, commandsPath, commandsFiles);

	await Client.launch();

	process.once("SIGINT", () => Client.stop("SIGINT"));
	process.once("SIGTERM", () => Client.stop("SIGTERM"));
};

export { Login as LoginTelegram };

export default Client;

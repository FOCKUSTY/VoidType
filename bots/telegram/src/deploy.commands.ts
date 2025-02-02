import type { Interaction } from "@voidy/types/dist/telegram/interaction.type";
import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";
import { Services } from "@voidy/types/dist/all/services.type";

import { Telegraf } from "telegraf";
import Commands from "./index.commands";
import Logger from "fock-logger";

import path from "node:path";

const CommandsLogger = new Logger("Commands").execute;
const FailLogger = new Logger("Fail").execute;

export const commands = new Map<
	string,
	{ execute: (interaction: Interaction) => Promise<void>; options: string[] }
>();

export type Props = Services & { llama: any };
type Command = new (services: Props) => TelegramCommand;

export default class Deployer {
	private readonly _services: Props;

	public constructor(services: Props) {
		this._services = services;
	}

	public execute(Client: Telegraf, commandsPath: string, commandsFiles: string[]) {
		for (const fileName of commandsFiles) {
			const filePath = path.join(commandsPath, fileName);
			const command: TelegramCommand = new (require(filePath).default as Command)(
				this._services
			);

			CommandsLogger(`Telegram команда ${command.name}`);

			if (command.execute && command.name) {
				commands.set(command.name, {
					execute: command.execute,
					options: command.options || undefined
				});

				Commands.commands = command.name;
				Commands.setCommand({
					name: command.name,
					options: command.options || [],
					executeFunc: command.executeFunc,
					execute: command.execute
				});
				Client.command(command.name, async (message: Interaction) =>
					command.execute(message)
				);
			} else
				FailLogger(
					`Потерян execute или name в ${command?.name || fileName}\nПуть: ${filePath}`
				);
		}
	}
}

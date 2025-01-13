import type { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";
import Commands from "telegram/index.commands";
import Logger from "fock-logger";

import path from "node:path";

const CommandsLogger = new Logger("Commands").execute;
const FailLogger = new Logger("Fail").execute;

export const commands = new Map<
	string,
	{ execute: <T = void>(interaction: Interaction) => T; options: string[] }
>();

export const DeployCommands = (
	Client: Telegraf,
	commandsPath: string,
	commandsFiles: string[]
) => {
	for (const fileName of commandsFiles) {
		const filePath = path.join(commandsPath, fileName);
		const command: {
			name: string;
			options: string[];
			execute: <T = void>(interaction: Interaction) => T;
			executeFunc?: <T, K = void>(...args: T[]) => K;
		} = require(filePath);

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
				executeFunc: command.executeFunc
			});
			Client.command(command.name, async (message: Interaction) =>
				command.execute(message)
			);
		} else
			FailLogger(
				`Потерян execute или name в ${command?.name || fileName}\nПуть: ${filePath}`
			);
	}
};

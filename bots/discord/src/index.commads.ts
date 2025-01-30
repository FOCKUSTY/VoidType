import Command from "@voidy/types/dist/commands/discord-command.type";
import path from "path";
import fs from "fs";

const commands: string[] = [];

const foldersPath = path.join(
	`${process.env.NODE_ENV === "dev" ? "src" : "dist/src"}/discord/commands`
);
const commandsFolder = fs.readdirSync(foldersPath);

for (const placeFolder of commandsFolder) {
	const commandsPath = path.join(foldersPath, placeFolder);
	const commandsFiles = fs.readdirSync(commandsPath);

	for (const folder of commandsFiles) {
		const modifierPath = path.join(commandsPath, folder);
		const files = fs
			.readdirSync(modifierPath)
			.filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));

		for (const file of files) {
			const filePath = path.join(modifierPath, file);
			const command: Command = require(
				path.toNamespacedPath(filePath).replace("\\\\?\\", "")
			);

			if ("data" in command && "execute" in command)
				commands.push(command.data.name);
		}
	}
}

export default commands;

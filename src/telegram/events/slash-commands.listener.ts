import { Debug } from "src/develop/debug.develop";
import { Interaction } from "src/types/telegram/interaction.type";
import { commands } from "telegram/deploy.commands";

const SlashCommandsListener = async (message: Interaction) => {
	if (!(message.text && message.text.startsWith("/"))) return;

	Debug.Log([
		"Запуск Telegram команды",
		message.from?.username || message.from?.first_name
	]);

	const commandName = message.text.includes(" ")
		? message.text.slice(1, message.text.indexOf(" "))
		: message.text.slice(1, message.text.length);

	Debug.Log(["Telegram Команда:", commandName]);

	const command = commands.get(commandName);

	if (!command)
		return Debug.Warn(["Telegram Команда", `"${commandName}"`, "не была найдена"]);

	try {
		command.execute(message);
	} catch (err) {
		Debug.Error(err);
	}
};

export default SlashCommandsListener;

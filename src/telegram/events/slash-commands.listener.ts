import { Debug } from "src/develop/debug.develop";
import { Interaction } from "src/types/telegram/interaction.type";
import { commands } from "telegram/deploy.commands";

const SlashCommandsListener = async (message: Interaction) => {
	if (!(message.text && message.text.startsWith("/"))) return;

	const commandName = message.text.slice(1, message.text.length);
	const command = commands.get(commandName);

	if (!command) return;

	try {
		command.execute(message);
	} catch (err) {
		Debug.Error(err);
	}
};

export default SlashCommandsListener;

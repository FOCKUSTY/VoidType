import { Interaction } from "@voidy/types/dist/telegram/interaction.type";
import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";

export default class Command extends TelegramCommand {
	public constructor() {
		super({
			name: "help",
			async execute(interaction: Interaction) {
				await interaction.reply("Команда не доработана");
			}
		});
	}
}

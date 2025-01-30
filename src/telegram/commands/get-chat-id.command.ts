import { Interaction } from "src/types/telegram/interaction.type";
import Telegram from "telegram/utility/service/telegram.service";

export = {
	name: "get_chat_id",
	async execute(interaction: Interaction) {
		return await interaction.reply(
			`${(await new Telegram().GetChatId(interaction)).data}`
		);
	}
};

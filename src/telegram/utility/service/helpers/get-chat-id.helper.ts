import { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";

const GetChatId = async (
	msg: Interaction
): Promise<number | string> => {
	const chatId = await msg.chat.id;
	const fromId = msg.from?.id;

	if (fromId) return fromId;

	return chatId;
};

export default GetChatId;

import { Format } from "telegraf";

import type { Interaction } from "types/telegram/interaction.type";
import type { Option, SendData } from "types/telegram/options.type";

import Telegram from "telegram/utility/service/telegram.service";

import { Debug } from "develop/debug.develop";

const options = new Map<string | number, Option<any>[]>();
const saved = new Map<string, { key: string; value: string }[]>();
const anonMessages = new Map<string, string>();

const send = async <T>(data: SendData<T, { text: string }>) => {
	if (data.response.type === 1) {
		const text = data.option.text
			.replace("%SUCCESS%", data.response.text)
			.replace("%MESSAGE%", data.response.data.text);

		Debug.Log(["Telegram Ответ\n" + text]);

		data.message.reply(text);
	} else {
		const text = data.option.error.replace("%ERROR%", data.response.text);

		Debug.Warn(text + "\nTelegram Команда: " + data.option.command);
		data.message.reply(text);
	}
};

const MessageListener = async (message: Interaction) => {
	if ((message.text && message.text.startsWith("/")) || !message.from?.id) return;

	const userId = message.from.id;
	const replyId = message.update?.message?.reply_to_message?.message_id || -1;
	const anonUser = anonMessages.get(replyId);

	if (anonUser && message.text) {
		anonMessages.delete(replyId);

		const intro = "Спасибо, что пользуетесь The Void !";
		const main = `Вам пришёл ответ от ${message.from.username || message.from.first_name}!`;
		const text = Format.code(`${intro}\n\n${main}\n\n${message.text}`);

		if (text.entities)
			text.entities[0] = {
				offset: intro.length + main.length + 4,
				length: message.text.length,
				type: "code"
			};

		const data = new Telegram().Send(anonUser, text);

		return data.then((d) =>
			typeof d.data !== "string"
				? message.reply(`${intro}\n\nВаше сообщение:\n${d.data.text}`)
				: undefined
		);
	}

	const replyOptions = options.get(userId);

	if (!replyOptions) return;

	for (const i in replyOptions) {
		const index = Number(i);
		const option: Option<any> = replyOptions[index];

		if (message.message.message_id - 2 === option.id) {
			const savedOptions = saved.get(`${userId}`) || [];

			saved.set(`${userId}`, [
				...savedOptions,
				{ key: option.option, value: message.message.text }
			]);
		}

		if (message.message.message_id === option.id) {
			return message.reply(option.text);
		} else if (index === replyOptions.length - 1) {
			const savedOptions = saved.get(`${userId}`) || [];
			const args = savedOptions.map((element) => element.value);

			if (!option.function) return;

			const response = await option.function(
				...(option.firstArgs || []),
				...args,
				...(option.addArgs || [])
			);

			options.delete(userId);
			saved.delete(`${userId}`);

			if (option.execute)
				return option.execute<any, { text: string }>({
					message,
					option,
					response,
					send
				});
			else return send({ message, option, response });
		}
	}
};

export { options, anonMessages };

export default MessageListener;

import { Format } from "telegraf";

import { Interaction } from "src/types/telegram/interaction.type";
import { Option } from "types/telegram/options.type";
import { Response } from "types/telegram/response.type";
import Telegram from "telegram/utility/service/telegram.service";

const options = new Map<string | number, any[]>();
const saved = new Map<string, { key: string; value: string }[]>();
const anonMessages = new Map<string, string>();

const MessageListener = async (message: Interaction) => {
	if ((message.text && message.text.startsWith("/")) || !message.from?.id) return;

	const userId = message.from.id;
	const replyId = message.update?.message?.reply_to_message?.message_id;
	const anonUser = anonMessages.get(replyId || -1);

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

		const data = await new Telegram().Send(anonUser, text);

		return await message.reply(`${intro}\n\nВаше сообщение:\n${data.data.text}`);
	}

	const replyOptions = options.get(userId);

	if (!replyOptions) return;

	for (const i in replyOptions) {
		const index = Number(i);
		const option: Option = replyOptions[index];

		if (message.message.message_id - 2 === option.id) {
			const savedOptions = saved.get(`${userId}`) || [];

			saved.set(`${userId}`, [
				...savedOptions,
				{ key: option.option, value: message.message.text }
			]);
		}

		if (message.message.message_id === option.id) {
			return await message.reply(option.text);
		} else if (index === replyOptions.length - 1) {
			const savedOptions = saved.get(`${userId}`) || [];
			const args = savedOptions.map((element) => element.value);

			if (!option.function) return;

			const res: Response = await option.function(
				...(option.firstArgs || []),
				...args,
				...(option.addArgs || [])
			);

			options.delete(userId);
			saved.delete(`${userId}`);

			if (res.data.then) {
				if (res.type === 0)
					return await message.reply(option.error.replace("%ERROR%", res.text));

				res.data.then(async (data: any) => {
					await message.reply(
						option.text
							.replace("%SUCCESS%", res.text)
							.replace(
								"%MESSAGE%",
								eval("data" + res?.dataContent?.text || "text")
							)
					);
				});

				return;
			}

			if (option.command === "send_anonimus_message") {
				const id = res.data?.data?.message_id;
				const from = res.data?.userId;

				if (!id || !from) return;

				anonMessages.set(id, from);
			}

			if (res.type === 1)
				return await message.reply(
					option.text
						.replace("%SUCCESS%", res.text)
						.replace("%MESSAGE%", await res.data.text)
				);
			else return await message.reply(option.error.replace("%ERROR%", res.text));
		}
	}
};

export { options, anonMessages };

export default MessageListener;

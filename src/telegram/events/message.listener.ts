import { Interaction } from "src/types/telegram/interaction.type";
import { Option } from "types/telegram/options.type";
import { Response } from "types/telegram/response.type";

const options = new Map<string | number, any[]>();
const saved = new Map<string, { key: string; value: string }[]>();

const MessageListener = async (message: Interaction) => {
	if ((message.text && message.text.startsWith("/")) || !message.from?.id) return;

	const userId = message.from.id;
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

			console.log(args);
			console.log(option);

			const res: Response = await option.function(
				...(option.firstArgs || []),
				...args,
				...(option.addArgs || [])
			);

			console.log(res);

			options.delete(userId);
			saved.delete(`${userId}`);

			if (res.type === 1)
				return await message.reply(
					option.text
						.replace("%SUCCESS%", res.text)
						.replace("%MESSAGE%", res.data.text)
				);
			else return await message.reply(option.error.replace("%ERROR%", res.text));
		}
	}
};

export { options };

export default MessageListener;

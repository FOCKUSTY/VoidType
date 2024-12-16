import { Interaction } from "types/telegram/interaction.type";
import { anonMessages, options } from "telegram/events/message.listener";
import { ExecuteData, Option } from "types/telegram/options.type";

import Telegram from "telegram/utility/service/telegram.service";

export = {
	name: "send_anonimus_message",
	options: ["userId", "message"],
	async execute(interaction: Interaction) {
		const replyOptions: Option[] = [
			{
				command: "send_anonimus_message",
				option: "userId",
				error: "",
				text: "Введите id того, кому нужно доставить!",

				id: interaction.message.message_id + 0
			},
			{
				command: "send_anonimus_message",
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id + 2
			},
			{
				command: "send_anonimus_message",
				option: "end",
				error: "Сообщение не было доставлено\nОшибка:\n%ERROR%",
				text: "%SUCCESS%\nСообщение:\n%MESSAGE%",
				function: new Telegram().SendAnonMessage,
				execute: (data: ExecuteData) => {
					const id = data.response.data?.data?.message_id;
					const from = data.response.data?.userId;

					if (!id || !from) return;

					anonMessages.set(id, from);

					data.send(data);
				},

				addArgs: [interaction.from?.id!],
				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(replyOptions[0].text);
	},
	async executeFunc(interaction: Interaction, userId: number | string) {
		const replyOptions: Option[] = [
			{
				command: "send_anonimus_message",
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id
			},
			{
				command: "send_anonimus_message",
				option: "end",
				error: "Сообщение не было доставлено\n\nОшибка:\n%ERROR%",
				text: "%SUCCESS%\nСообщение:\n%MESSAGE%",
				function: new Telegram().SendAnonMessage,
				execute: (data: ExecuteData) => {
					const id = data.response.data?.data?.message_id;
					const from = data.response.data?.userId;

					if (!id || !from) return;

					anonMessages.set(id, from);

					data.send(data);
				},

				firstArgs: [userId],
				addArgs: [interaction.from?.id!],
				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(
			"Спасибо, что пользуетесь The Void!\n" + replyOptions[0].text
		);
	}
};

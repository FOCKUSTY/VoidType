import { Interaction } from "types/telegram/interaction.type";
import { options } from "telegram/events/message.listener";
import { Option } from "types/telegram/options.type";

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

import { Interaction } from "types/telegram/interaction.type";
import { options } from "telegram/events/message.listener";
import Telegram from "telegram/utility/service/telegram.service";
import { Option } from "types/telegram/options.type";

export = {
	name: "send_anonimus_message",
	options: ["userId", "message"],
	async execute(interaction: Interaction) {
		const replyOptions: Option[] = [
			{
				option: "userId",
				error: "",
				text: "Введите id того, кому нужно доставить!",

				id: interaction.message.message_id + 0
			},
			{
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id + 2
			},
			{
				option: "end",
				error: "Сообщение не было доставлено\nОшибка: %ERROR%",
				text: "%SUCCESS%\nСообщение: %MESSAGE%",
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
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id
			},
			{
				option: "end",
				error: "Сообщение не было доставлено\nОшибка: %ERROR%",
				text: "%SUCCESS%\nСообщение: %MESSAGE%",
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

import { Interaction } from "types/telegram/interaction.type";
import { ExecuteData, Option, SendData } from "types/telegram/options.type";

import { options } from "telegram/events/message.listener";

import Discord from "discord/utility/service/discord.service";

export = {
	name: "send_message_to_discord",
	options: ["channelId", "message"],
	async execute(interaction: Interaction) {
		const replyOptions: Option[] = [
			{
				command: "send_message_to_discord",
				option: "channelId",
				error: "",
				text: "Введите id канала",

				id: interaction.message.message_id + 0
			},
			{
				command: "send_message_to_discord",
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id + 2
			},
			{
				command: "send_message_to_discord",
				option: "end",
				error: "Не удалось отправить сообщение в Discord\n\nОшибка:\n%ERROR%",
				text: "Сообщение было отправлено в Discord\n\nСообщение:\n%SUCCESS%",
				function: new Discord().SendMessageToTelegram,

				addArgs: [interaction.from?.username || interaction.from?.first_name],
				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(replyOptions[0].text);
	},
	async executeFunc(interaction: Interaction, userId: number | string) {
		const replyOptions: Option[] = [
			{
				command: "send_message_to_discord",
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id
			},
			{
				command: "send_message_to_discord",
				option: "end",
				error: "Не удалось отправить сообщение в Discord\nОшибка: %ERROR%",
				text: "Сообщение было отправлено в Discord\nСообщение: %SUCCESS%",
				function: new Discord().SendMessageToTelegram,

				addArgs: [
					userId,
					interaction.from?.username || interaction.from?.first_name
				],
				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);
		await interaction.reply(replyOptions[0].text);
	}
};

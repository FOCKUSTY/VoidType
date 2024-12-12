import { options } from "telegram/events/message.listener";
import { Interaction } from "types/telegram/interaction.type";
import Discord from "discord/utility/service/discord.service";

export = {
	name: "send_message_to_discord",
	options: ["channelId", "message"],
	async execute(interaction: Interaction) {
		const replyOptions = [
			{
				option: "channelId",
				error: "",
				text: "Введите id канала",

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
				error: "Не удалось отправить сообщение в Discord\nОшибка: %ERROR%",
				text: "Сообщение было отправлено в Discord\nСообщение: %SUCCESS%",
				function: new Discord().SendMessageToTelegram,

				addArgs: [interaction.from?.username || interaction.from?.first_name],
				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(replyOptions[0].text);
	},
	async executeFunc(interaction: Interaction, userId: number | string) {
		const replyOptions = [
			{
				option: "message",
				error: "",
				text: "Введите сообщение",

				id: interaction.message.message_id
			},
			{
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

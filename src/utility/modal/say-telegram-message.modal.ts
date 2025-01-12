import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";

import TelegramClass from "telegram/utility/service/telegram.service";
import customIds from "./custom-ids.modal";

const TelegramClient = new TelegramClass();

const SayTelegramMessage = async (interaction: ModalSubmitInteraction) => {
	const components = customIds.sayTelegramModal.components;

	const channelId: string = interaction.fields.getTextInputValue(
		components.sayTelegramChannel
	);
	const message: string = interaction.fields.getTextInputValue(
		components.sayTelegramMessage
	);

	try {
		const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({
				name: "The Void",
				iconURL: interaction.client.user.avatarURL() || undefined
			})
			.setTitle("Сообщение:")
			.setDescription(message.replace(/\\\\n/g, "\n"))
			.setTimestamp();

		TelegramClient.SendMessage(
			channelId,
			`Сообщение с Discord от ${
				interaction.user.globalName
					? interaction.user.globalName
					: interaction.user.username
			}:\n${message}`
		);

		return interaction.reply({
			content: `Сообщение было доставлено на: ${channelId}`,
			embeds: [embed],
			ephemeral: true
		});
	} catch (err) {
		return interaction.reply({
			content: `Сообщение не было доставлено на Ваш канал \`\`\`${err}\`\`\``,
			ephemeral: true
		});
	}
};

export default SayTelegramMessage;

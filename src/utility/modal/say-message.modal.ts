import { EmbedBuilder, ModalSubmitInteraction, PermissionsBitField } from "discord.js";

import customIds from "./custom-ids.modal";

const SayMessage = async (interaction: ModalSubmitInteraction) => {
	const components = customIds.sayModal.components;
	const channelId: any = interaction.fields.getTextInputValue(components.sayChannel);
	const channel: any = interaction.client.channels.cache.get(channelId);

	if (!channel || !interaction.guild)
		return await interaction.reply({
			content: "Ошибка при поиске канала, попробуйте снова",
			ephemeral: true
		});

	if (
		!channel
			.permissionsFor(interaction.client.user.id)
			.has([
				PermissionsBitField.Flags.SendMessages,
				PermissionsBitField.Flags.ViewChannel
			])
	) {
		return await interaction.reply({
			content:
				"Сообщение не было доставлено на Ваш канал, возможны причины:\n\
            1. Ваш канал не является текстовым каналом\n\
            1. У меня не достаточно прав отправить сообщение на Ваш канал",
			ephemeral: true
		});
	}

	const message: any = interaction.fields.getTextInputValue(components.sayMessage);

	try {
		if (message.length > 2000) {
			const embed = new EmbedBuilder()
				.setColor(0x161618)
				.setAuthor({
					name: interaction.user.globalName || interaction.user.username,
					iconURL: interaction.user.avatarURL() || undefined
				})
				.setTitle(interaction.guild.name)
				.setDescription(message.replaceAll("\\n", "\n"))
				.setTimestamp();

			channel.send({ embeds: [embed] });
		} else {
			channel.send(`${message.replaceAll("\\n", "\n")}`);
		}

		const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({
				name: "The Void",
				iconURL: interaction.client.user.avatarURL() || undefined
			})
			.setTitle("Сообщение:")
			.setDescription(message.replaceAll("\\n", "\n"))
			.setTimestamp();

		return await interaction.reply({
			content: `Сообщение было доставлено на: ${channel}`,
			embeds: [embed],
			ephemeral: true
		});
	} catch (err) {
		return await interaction.reply({
			content: `Сообщение не было доставлено на Ваш канал, возможны причины:\n\
            Ваш канал не является текстовым каналом\n\
            У меня не достаточно прав отправить сообщение на Ваш канал\n\
            ## Ошибка:\n\
            \`\`\`${err}\`\`\``,
			ephemeral: true
		});
	}
};

export default SayMessage;

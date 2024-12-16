import { EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";

import { config } from "src/index.config";

import customIds from "./custom-ids.modal";

const IdeaModal = async (interaction: ModalSubmitInteraction) => {
	const components = customIds.ideaModal.components;
	const channel = interaction.client.channels.cache.get(
		config.ideaChannelId
	) as TextChannel;

	const title = interaction.fields.getTextInputValue(components.title);
	const description = interaction.fields.getTextInputValue(components.description);

	const embed = new EmbedBuilder()
		.setAuthor({
			name: interaction.user.globalName
				? interaction.user.globalName
				: interaction.user.username,
			iconURL: interaction.user.avatarURL() || undefined
		})
		.setThumbnail(interaction.guild?.iconURL() || config.guildIconURL)
		.setTitle(title)
		.setDescription(description)
		.setFields([
			{
				name: "Пользователь",
				value: `<@${interaction.user.id}>`,
				inline: true
			},
			{
				name: "Сервер",
				value: interaction.guild?.name || "В личных сообщениях",
				inline: true
			}
		])
		.setFooter({ text: "The Void Community", iconURL: config.guildIconURL })
		.setTimestamp();

	channel.sendTyping();

	setTimeout(async () => {
		const message = await channel.send({ embeds: [embed] });

		message.react("🎩");
		message.react("❌");
		message.react("💜");

		message.startThread({
			name: title,
			reason: description
		});
	}, 3000);

	return interaction.reply({
		content: "Ваша идея была доставлена",
		ephemeral: true,
		embeds: [embed]
	});
};

export default IdeaModal;

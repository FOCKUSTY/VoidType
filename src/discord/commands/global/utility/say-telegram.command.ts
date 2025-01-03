import {
	SlashCommandBuilder,
	ModalActionRowComponentBuilder,
	CommandInteraction,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
	ActionRowBuilder
} from "discord.js";

import GetObject from "utility/service/get-object.service";
import PseudoRandom from "utility/service/pseudo-random.service";
import customIds from "utility/modal/custom-ids.modal";

const history: number[] = [];

export = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("telegram-say")
		.setDescription("Сообщение с помощью бота!")
		.setNameLocalizations({ ru: "отправить-в-телеграм", "en-US": "telegram-say" })
		.setDescriptionLocalizations({
			ru: "Сообщение в телеграм с помощью бота",
			"en-US": "Message into telegram using a bot"
		}),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild)
			return await interaction.reply({
				content: "Вы находитесь не в гильдии",
				ephemeral: true
			});

		const components = customIds.sayTelegramModal.components;
		const idea = GetObject("idea");

		const modal = new ModalBuilder()
			.setCustomId(customIds.sayTelegramModal.id)
			.setTitle("Ваше сообщение !");
		const randomNumber = new PseudoRandom().Number(0, idea.length - 1, history, idea);
		const placeholder = idea[randomNumber].ideaDetail;

		modal.addComponents(
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(components.sayTelegramMessage)
					.setLabel("Ваше сообщение")
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setMaxLength(4000)
					.setPlaceholder(
						placeholder.length <= 100
							? placeholder
							: "Если сообщение будет больше 2к символов, оно отправиться в embed формате"
					)
			),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(components.sayTelegramChannel)
					.setLabel("Ваш id канала")
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
					.setMaxLength(30)
			)
		);

		await interaction.showModal(modal);
	}
};

import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";

import customIds from "./custom-ids.modal";
import { config } from "src/index.config";

import Telegram from "telegram/utility/service/telegram.service";
import Discord from "discord/utility/service/discord.service";

const Update = async (interaction: ModalSubmitInteraction) => {
	const components = customIds.updateModal.components;

	const version: string = interaction.fields.getTextInputValue(components.version);
	const ru: string = interaction.fields.getTextInputValue(components.ruText);
	const en: string = interaction.fields.getTextInputValue(components.enText);

	try {
		if (
			ru.length > 2000 ||
			en.length > 2000 ||
			`${version} ${ru} ${version} ${en}`.length >= 2000
		) {
			const embeds: EmbedBuilder[] = [];

			for (const text of [ru, en]) {
				embeds.push(
					new EmbedBuilder()
						.setColor(0x161618)
						.setAuthor({
							name:
								interaction.user.globalName || interaction.user.username,
							iconURL: interaction.user.avatarURL() || undefined
						})
						.setTitle(
							interaction.guild?.name ||
								interaction.user.globalName ||
								interaction.user.username
						)
						.setDescription(`# ${version}\n${text.replace(/\\\\n/g, "\n")}`)
						.setTimestamp()
				);
			}

			new Discord().SendMessage(config.changeLogDiscordChannelId, embeds);
			new Telegram().SendMessage(
				config.changeLogTelegramGroupId,
				`${version}\n${ru}`
			);
		} else {
			new Discord().SendMessage(
				config.changeLogDiscordChannelId,
				`# ${version}\n${ru}\n# ${version}\n${en}`
			);
			new Telegram().SendMessage(
				config.changeLogTelegramGroupId,
				`${version}\n${ru}`
			);
		}

		return interaction.reply({
			content: `Сообщение было доставлены в Telegram и Discord`,
			ephemeral: true
		});
	} catch (err) {
		return interaction.reply({
			content: `Сообщение не было доставлено на Ваш канал, возможны причины:\n\
            Ваш канал не является текстовым каналом\n\
            У меня не достаточно прав отправить сообщение на Ваш канал\n\
            ## Ошибка:\n\
            \`\`\`${err}\`\`\``,
			ephemeral: true
		});
	}
};

export default Update;

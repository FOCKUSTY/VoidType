import {
    EmbedBuilder,
    ModalSubmitInteraction
} from "discord.js";

import customIds from "./custom-ids.modal";
import Telegram from "telegram/utility/service/telegram.service";
import Discord from "discord/utility/service/discord.service";
import { config } from "config";

const Update = async (interaction: ModalSubmitInteraction) => {
    const components = customIds.updateModal.components;

    const version: any = interaction.fields.getTextInputValue(components.version);
    const ru: any = interaction.fields.getTextInputValue(components.ruText);
    const en: any = interaction.fields.getTextInputValue(components.enText);

	try  {
        if((ru.length > 2000 || en.length > 2000) || `${version} ${ru} ${version} ${en}`.length >= 2000) {
            const embeds: EmbedBuilder[] = [];

            for(const text of [ru, en])
            {
                embeds.push(new EmbedBuilder()
                    .setColor(0x161618)
                    .setAuthor({
                        name: interaction.user.globalName || interaction.user.username,
                        iconURL: interaction.user.avatarURL() || undefined
                    })
                    .setTitle(interaction.guild?.name || interaction.user.globalName || interaction.user.username)
                    .setDescription(`# ${version}\n${text.replaceAll('\\n', '\n')}`)
                    .setTimestamp()
                );
            };

            Discord.SendMessage(config.changeLogDiscordChannelId, embeds);
            Telegram.SendMessage(config.changeLogTelegramGroupId, [`${version}\n${ru}`, `${version}\n${en}`]);
        }
        else {
            Discord.SendMessage(config.changeLogDiscordChannelId, `# ${version}\n${ru}\n# ${version}\n${en}`);
            Telegram.SendMessage(config.changeLogTelegramGroupId, `${version}\n${ru}\n${version}\n${en}`);
        };

		return await interaction.reply({
			content: `Сообщение было доставлены в Telegram и Discord`,
            ephemeral: true
		});
	}
	catch (err) {
		return await interaction.reply({
			content:
            `Сообщение не было доставлено на Ваш канал, возможны причины:\n\
            Ваш канал не является текстовым каналом\n\
            У меня не достаточно прав отправить сообщение на Ваш канал\n\
            ## Ошибка:\n\
            \`\`\`${err}\`\`\``,
			ephemeral: true
		});
	}
};

export default Update;
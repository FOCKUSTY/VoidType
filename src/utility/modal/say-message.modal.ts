import { EmbedBuilder, GuildBasedChannel, ModalSubmitInteraction, PermissionsBitField } from "discord.js";
import customIds from "./custom-ids.modal";

const booleans: Map<string, boolean> = new Map();
const channels: Map<string, GuildBasedChannel> = new Map();

const SayMessage = async (interaction: ModalSubmitInteraction) => {
    const channel: any = channels.get(interaction.user.id);

    if(!channel || !interaction.guild)
        return await interaction.reply({ content: 'Ошибка при поиске канала, попробуйте снова' });

    if(!(channel.permissionsFor(interaction.client.user.id).has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel]))
    ) {
        return await interaction.reply({
            content:
            'Сообщение не было доставлено на Ваш канал, возможны причины:\n\
            1. Ваш канал не является текстовым каналом\n\
            1. У меня не достаточно прав отправить сообщение на Ваш канал',
            ephemeral: true
        });
    };

    const bool: any = booleans.get(interaction.user.id);
    const components = customIds.sayModal.components;
    const message: any = interaction.fields.getTextInputValue(components.sayMessage);
	
	if(bool) {
		const embed = new EmbedBuilder()
            .setColor(0x161618)
            .setAuthor({
                name: interaction.user.globalName || interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined
            })
            .setTitle(interaction.guild.name)
            .setDescription(message.replaceAll('\\n', '\n'))
            .setTimestamp()

		channel.send({embeds:[embed]});
	}
	else
		channel.send(`${message.replaceAll('\\n', '\n')}`)
	try  {
		const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({
                name: 'The Void',
                iconURL: interaction.client.user.avatarURL() || undefined
            })
			.setTitle('Сообщение:')
			.setDescription(message.replaceAll('\\n', '\n'))
			.setTimestamp()
	
		return await interaction.reply({
			content: `Сообщение было доставлено на: ${channel}`,
			embeds: [embed],
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

export {
    channels,
    booleans
};

export default SayMessage;
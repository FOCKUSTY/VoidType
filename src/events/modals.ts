import
{
	Interaction, InteractionType, EmbedBuilder, TextChannel,
	PermissionsBitField
} from "discord.js";

import { addRowIdeaDB } from '../utils/tags';
import { debug } from "../utils/developConsole";

let channel: any;
let bool: boolean;

export async function setChannel(op: any, int: any) {
	channel = await int.client.channels.fetch(`${op}`)
};
export function setBool(op: any) { bool = op };

export async function modalSubmit(this: any, int: Interaction) {

	const interaction = int;
    const client = int.client
    const user = int.user.globalName;
	const userAvatar = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`;
	let iconURL;
	if(int.guild!=undefined||int.guild!=null) {
		iconURL = `https://cdn.discordapp.com/icons/${int?.guild?.id}/${int?.guild?.icon}.png`
	} else {
		iconURL = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`
	}
	
	if(int.type === InteractionType.ModalSubmit) {

		if(int.customId==='ideaModal') {

			const ideaTitle = int.fields.getTextInputValue(`ideaTitle`);
			const ideaDetails = int.fields.getTextInputValue(`ideaDetails`);
	
				const embed = new EmbedBuilder()
				.setColor(0x161618)
				.setAuthor({name: `${user}`, iconURL: `${userAvatar}`})
				.setTitle(`${ideaTitle}`)
				.setThumbnail(`${iconURL}`)
				.setDescription(`${ideaDetails}`)
				.setFields(
					{name: `Пользователь:`, value: `<@${int.user.id}>`, inline: true},
					{name: `\n`, value: `\n`, inline: true},
					{name: `Сервер:`, value: `${int.guild?.name||`Не на сервере`}`, inline: true}
				)
				.setTimestamp();
	
		(client.channels.cache.get("1171051517910986752") as TextChannel).send({content: ``, embeds: [embed]});
		
				int.reply({content: `Ваша идея была доставлена!`, embeds: [embed], ephemeral: true});
					
				try {
					console.log(`Идея была доставлена\nИдея: ${ideaTitle}\nОписание: ${ideaDetails}\nНаписал: ${int.user?.username} (${int.user?.globalName})\nС сервера ${int.guild?.name}`);
					addRowIdeaDB(`${ideaTitle}`, `${int.user?.username}`, `${int.user?.globalName}`, `${ideaDetails}`, `${int.guild?.name}`)
				} catch (e) {
					console.log('Идея не была доставлена !')
					debug([e, true])
				}
		} else if(int.customId==='sayModal') {
			if(!(channel?.permissionsFor(interaction.client.user.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]))) {
            await int.reply({
            content:
            `Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал`,
            ephemeral: true});
            return
        };

		const msg: any = int.fields.getTextInputValue('message');

        if(bool) {
            const embed = new EmbedBuilder()
            .setColor(0x161618)
            .setAuthor({name: `${int?.user?.globalName||int?.user?.username}`, iconURL: `${int.user.avatarURL()}` })
            .setTitle(`${int?.guild?.name}`)
            .setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
            .setTimestamp()

            channel.send({embeds:[embed]})
        } else {
            channel.send(`${msg.replaceAll(`\\n`, `\n`)}`)
        }
        
        try {

        const embed = new EmbedBuilder()
        .setColor(0x161618)
        .setAuthor({name: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png`})
        .setTitle(`Сообщение:`)
        .setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
        .setTimestamp()
        
        await int.reply({
		content: `Сообщение было доставлено на: ${channel}`,
		embeds: [embed], ephemeral: true});

    } catch (err) {
        
        await int.reply({
        content:
        `Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал\n## Ошибка:\n\`\`\`${err}\`\`\``,
        ephemeral: true});
    }

		}

	};
}
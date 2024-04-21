import
{
	Interaction, InteractionType, EmbedBuilder, TextChannel,
	PermissionsBitField
} from "discord.js";

import { addUserTagToDB } from '../utils/tags';
import { debug } from "../utils/developConsole";
import { replyOnVCCModal } from "../utils/sendVoiceTools";
import { setMTUOJ, updateMTUOJ, deleteMTUOJ } from '../utils/messsageToUserOnJoin'

let channel: any;
let bool: boolean;
let versionUpdate: string;
const userBooleans = new Map();
const userTypes = new Map();

export =
{
	name: 'modalSubmit',
	async modalSubmit(this: any, int: Interaction)
	{
	
		const interaction = int;
		const client = int.client
		const user = int.user.globalName;
		const userAvatar = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`;
		let iconURL;
		if(int.guild!=undefined||int.guild!=null)
		{
			iconURL = `https://cdn.discordapp.com/icons/${int?.guild?.id}/${int?.guild?.icon}.png`
		}
		else
		{
			iconURL = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`
		}
		
		if(int.type === InteractionType.ModalSubmit)
		{
	
			if(int.customId==='ideaModal')
			{
	
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
						
					try
					{
						console.log(`Идея была доставлена\nИдея: ${ideaTitle}\nОписание: ${ideaDetails}\nНаписал: ${int.user?.username} (${int.user?.globalName})\nС сервера ${int.guild?.name}`);
						addUserTagToDB(`${ideaTitle}`, {username: `${int.user.username}`, globalName: `${int.user.globalName}`}, `${ideaDetails}`, {name: `${int.guild?.name}`})
					}
					catch (e)
					{
						console.log('Идея не была доставлена !')
						debug([e, true])
					}
			}
			else if(int.customId==='sayModal')
			{
				if(!(channel?.permissionsFor(interaction.client.user.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]))) {
				await int.reply({
					content:
					`Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал`,
					ephemeral: true
				});
				return;
			};
	
			const msg: any = int.fields.getTextInputValue('message');
	
			if(bool)
			{
				const embed = new EmbedBuilder()
				.setColor(0x161618)
				.setAuthor({name: `${int?.user?.globalName||int?.user?.username}`, iconURL: `${int.user.avatarURL()}` })
				.setTitle(`${int?.guild?.name}`)
				.setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
				.setTimestamp()
	
				channel.send({embeds:[embed]});
			}
			else
			{
				channel.send(`${msg.replaceAll(`\\n`, `\n`)}`)
			}
				try 
				{
	
					const embed = new EmbedBuilder()
						.setColor(0x161618)
						.setAuthor({name: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png`})
						.setTitle(`Сообщение:`)
						.setDescription(`${msg.replaceAll(`\\n`, `\n`)}`)
						.setTimestamp()
				
					await int.reply({
						content: `Сообщение было доставлено на: ${channel}`,
						embeds: [embed], ephemeral: true
					});
	
				}
				catch (err)
				{
				
					await int.reply({
						content:
						`Сообщение не было доставлено на Ваш канал, возможны причины:\nВаш канал не является текстовым каналом\nУ меня не достаточно прав отправить сообщение на Ваш канал\n## Ошибка:\n\`\`\`${err}\`\`\``,
						ephemeral: true
					});
				}
			}
			else if(int.customId==='MTUOJmodal')
			{
				if(!interaction.guild)
					return 0;
	
				const type = userTypes.get(interaction.guild.id);
	
				if(type === 'delete')
					return await deleteMTUOJ(interaction.guild.id).then(async data =>
						await int.reply({content: data.text, ephemeral: true}));
	
				const text = int.fields.getTextInputValue('text');
				const boolean = userBooleans.get(int.user.id);
	
				if(type === 'create')
					return await setMTUOJ({guildId: interaction.guild.id, isEnabled: boolean, text: text}).then(async data =>
						await int.reply({content: data.text, ephemeral: true}));
	
				else
					return await updateMTUOJ({guildId: interaction.guild.id, isEnabled: boolean, text: text}).then(async data =>
						await int.reply({content: data.text, ephemeral: true}));
			}
	
	
			else replyOnVCCModal(int);
		};
	},

	async setChannel(op: any) { channel = await op; },
	setBoolToUser(userId: string, boolean: boolean) { userBooleans.set(userId, boolean) },
	setTypeToUser(guildId: string, type: string = 'update'||'create'||'delete') { userTypes.set(guildId, type) },
	setBool(op: any) { bool = op },
	setVersionUpdate(version: string) { versionUpdate = `\n# Версия: ${version}` },

}

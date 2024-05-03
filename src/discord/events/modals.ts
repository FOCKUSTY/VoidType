import { Interaction, InteractionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { debug } from "../utils/developConsole";
import { replyOnVCCModal } from "../utils/sendVoiceTools";
import { getDevelop } from "../utils/develop";
import { sendMessage as sendMessageToTelegram } from "src/telegram/utility/sendMessage";
import { sendMessage as sendMessageToDiscord } from "../utils/sendMessage";
import config from 'config';

import { MTUOJAttributes as MTUOJType, ideaType, statusMongoose as status, Error, statusMongoose } from 'databaseTypes';
import database from '@database';

const MTUOJ = database.mongooseDatabase.MTUOJ;
const idea = database.mongooseDatabase.ideas;

let channel: any;
let bool: boolean;
let versionUpdate: string;

const chatIds = new Map();
const versions = new Map();
const userBooleans = new Map();
const userTypes = new Map();

export =
{
	name: 'modalSubmit',
	async modalSubmit(this: any, int: Interaction)
	{
	
		const clientIconUrl = getDevelop('iconurl');

		const interaction = int;
		const client = int.client;
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
		
					const channel = client.channels.cache.get("1171051517910986752");

					if(!channel || !channel.isTextBased())
						return await int.reply({content: 'Возможно, канал не является текстовым или причина в другом', ephemeral: true});

					channel.send({content: ``, embeds: [embed]}).then(async (message) =>
					{
						try
						{							
							await message.react('🎩');
							await message.react('💜');
							await message.react('❌');
							
							await message.startThread({
								name: `${ideaTitle}`,
								autoArchiveDuration: 60,
								reason: `${ideaDetails}`,
							});
						}
						catch (err)
						{
							console.error(err)
						}
					})
			
					await int.reply({content: `Ваша идея была доставлена!`, embeds: [embed], ephemeral: true});
						
					try
					{
						const data: ideaType =
						{
							description: ideaDetails,
							ideaName: ideaTitle,
							globalname: int.user.globalName||int.user.username,
							username: int.user.username,
							guildname: int.guild?.name||'Не на сервере'
						};

						await idea.createIdea(data).then((status: statusMongoose) =>
						{
							if(status.type === 'successed')
								console.log(`Идея была доставлена\nИдея: ${ideaTitle}\nОписание: ${ideaDetails}\nНаписал: ${int.user?.username} (${int.user?.globalName})\nС сервера ${int.guild?.name}`);
							else
								console.error(status.error);
						})
						
					}
					catch (e)
					{
						console.log('Идея не была доставлена !')
						debug([e], false, false, this)
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
						.setAuthor({name: `The Void`, iconURL: clientIconUrl})
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
					await MTUOJ.deleteMTUOJ(interaction.guild.id).then(async (status: statusMongoose) =>
						await int.reply({content: status.text, ephemeral: true}));
	
				const text = int.fields.getTextInputValue('text');
				const boolean = userBooleans.get(int.user.id);
	
				const data: MTUOJType = {
					guildId: interaction.guild.id,
					isEnables: boolean,
					text: text
				};

				if(type === 'create')
					return await MTUOJ.setMTUOJ(data).then(async (status: statusMongoose) =>
						await int.reply({content: status.text, ephemeral: true}));
	
				else
					return await MTUOJ.updateMTUOJ(data).then(async (status: statusMongoose) =>
						await int.reply({content: status.text, ephemeral: true}));
			}
			else if(int.customId==='sendMessageToTelegramModal')
			{
				try 
				{
					const msg: string = int.fields.getTextInputValue('message');
	
					const embed = new EmbedBuilder()
						.setColor(0x161618)
						.setAuthor({name: `The Void`, iconURL: clientIconUrl})
						.setTitle(`Сообщение:`)
						.setDescription(`${msg.replace(`\\n`, `\n`)}`)
						.setTimestamp()
				
					await sendMessageToTelegram({chatId:chatIds.get(int.user.id), text: msg}).then(async (data) =>
					{
						await int.reply({
							content: `Сообщение было доставлено на: ${data.data?.chat.id}`,
							embeds: [embed], ephemeral: true
						});
					})
				}
				catch (err)
				{
				
					await int.reply({
						content:
						`Сообщение не было доставлено на Ваш канал, возможны причины:\nУ меня не достаточно прав отправить сообщение на Ваш канал\n## Ошибка:\n\`\`\`${err}\`\`\``,
						ephemeral: true
					});
				}
			}
			else if(int.customId==='writeChangeLogModal')
			{
				try 
				{
					const ruChanges: string = int.fields.getTextInputValue('ru-changes');
					const enChanges: string = int.fields.getTextInputValue('en-changes');
					const version: string = versions.get(int.user.id);

					const discordChangeLog = `# 🇷🇺 - Русский\n# ${version}\n${ruChanges}# 🇺🇸 - English\n# ${version}\n${enChanges}`;
					const telegramChangeLog = `${version}\n${ruChanges}`;
					const bottomlessHatChangeLog = `# ${version}\n${ruChanges}`;

					const embed = new EmbedBuilder()
						.setColor(0x161618)
						.setAuthor({name: `The Void`, iconURL: clientIconUrl})
						.setTitle(`Сообщение:`)
						.setDescription(`${discordChangeLog.replace(`\\n`, `\n`)}`)
						.setTimestamp();
				
					try
					{
						type errorType =
						{
							isError: boolean;
							sendMessageToDiscord_BottomlessHatChangeLog?: string
							sendMessageToDiscord_TheVoidChangeLogChannelId?: string;
							sendMessageToTelegram_TelegramChangeLog?: string;
						};

						let isError: errorType = { isError: false };
						let outputError: string = '';

						await sendMessageToDiscord({channelId: config.bottomlessHatChangeLogChannelId, text: bottomlessHatChangeLog, client: client})
							.then((data: status) =>
							{
								if(data.type === 'error')
									isError = {
										isError: true,
										sendMessageToDiscord_BottomlessHatChangeLog: `Произошла ошибка при выполнении sendMessageToDiscord Bottomless Hat Change Log\n${data.error}\n${data.text}`
									};
							})
						await sendMessageToDiscord({channelId: config.theVoidChangeLogChannelId, text: discordChangeLog, client: client})
							.then((data: status) =>
							{
								if(data.type === 'error')
									isError = {
										isError: true,
										sendMessageToDiscord_TheVoidChangeLogChannelId: `Произошла ошибка при выполнении sendMessageToDiscord The Void Change Log\n${data.error}\n${data.text}`
									};
							})
						await sendMessageToTelegram({chatId:'@BottomlessHat', text: telegramChangeLog})
							.then((data: status) =>
							{
								if(data.type === 'error')
									isError = {
										isError: true,
										sendMessageToTelegram_TelegramChangeLog: `Произошла ошибка при выполнении sendMessageToTelegram Telegram Change Log\n${data.error}\n${data.text}`
									};
							});

						if(isError.isError)
						{
							for(let key in isError)
								if(key != 'isError')
									outputError += `\n${eval(`isError.${key}`)}`;

							await int.reply({content: outputError, ephemeral: true});
							
							return new Error(isError);
						}
						else
							return await int.reply({content: 'Все сообщения успешно дошли !', ephemeral: true});
					}
					catch (err)
					{
						console.log(err);
						return new Error(err);
					};
				}
				catch (err)
				{
					await int.reply({
						content: `Сообщение не было доставлено на Ваш канал, возможны причины:\nУ меня не достаточно прав отправить сообщение на Ваш канал\n## Ошибка:\n\`\`\`${err}\`\`\``,
						ephemeral: true
					});
				};
			}

			else replyOnVCCModal(int);
		};
	},

	async setChannel(op: any) { channel = await op; },
	setBoolToUser(userId: string, boolean: boolean) { userBooleans.set(userId, boolean) },
	setTypeToUser(guildId: string, type: string = 'update'||'create'||'delete') { userTypes.set(guildId, type) },
	setBool(op: any) { bool = op },
	setVersionUpdate(version: string) { versionUpdate = `\n# Версия: ${version}` },
	chatIds,
	versions

}

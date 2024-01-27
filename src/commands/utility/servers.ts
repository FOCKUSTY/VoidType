import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, time } from 'discord.js';
let verLevel = [
	`Нет`,
	`Маленький`,
	`Средний`,
	`Высокий`,
	`Серьезный`,
]

module.exports =
{
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Информация о сервере')
		.setNameLocalizations({ru:'сервер',"en-US":'server'})
		.setDescriptionLocalizations({ru:'Информация о сервере',"en-US":'Info about server'}),
	async execute(interaction: CommandInteraction)
	{
		const int: CommandInteraction = interaction;
		if(int.guild!=undefined||int.guild!=null)
		{

			const numerVerLevel: number = int.guild.verificationLevel
			let textVerLevel: string = verLevel[numerVerLevel]

			var guildDescriptionName: string;
			var guildDescriptionValue: string;
			
			if(int.guild?.description == null)
			{
				guildDescriptionName = `На сервере нет описания`
				guildDescriptionValue = `**Даже не ищите его**`
			}
			else
			{
				guildDescriptionName = `Описание сервера: `
				guildDescriptionValue = int.guild?.description
			}
		
			await int.reply({ content: '# :tophat:\n Ищем информацию...', fetchReply: true, ephemeral: true});

			var totalRoles: number = int.guild.roles.cache.size

			const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setTitle('Информация')
			.setAuthor({ name: int.guild.name, iconURL: `https://cdn.discordapp.com/icons/${int.guild.id}/${int.guild.icon}.png` })
			.setDescription(`Информация о сервере ${int.guild.name}`)
   			.addFields(
				{ name: `Сервер создан`, value: `${time(int.guild.createdAt)}\nЭто:\n${time(int.guild.createdAt, `R`)}`, inline: true },
				{ name: `${guildDescriptionName}`, value: `${guildDescriptionValue}`, inline: true },
   		    	{ name: `На сервере`, value: `${int.guild.memberCount} участника`, inline: true },
				{ name: 'Количество ролей на сервере:', value: `${totalRoles}`, inline: true },
				{ name: 'Уровень проверки:', value: `${textVerLevel}`, inline: true },
				{ name: 'Команду запустил:', value: `${int.user} (${int.user.username})`, inline: true },
			)
			.setThumbnail(`https://cdn.discordapp.com/icons/${int.guild.id}/${int.guild.icon}.png`)
			.setTimestamp()
			.setFooter({ text: `Id: ${int.guild.id}`, iconURL: `https://cdn.discordapp.com/icons/${int.guild.id}/${int.guild.icon}.png` });

			int.editReply({
				content: ``,
				embeds: [embed],
			})
		} else await int.reply({content: `Данный тип команд работает только на сервере`, ephemeral: true})
	}
};
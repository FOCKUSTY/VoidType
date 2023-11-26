import {
    CommandInteraction, SlashCommandBuilder,
    Client,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    InteractionReplyOptions,
    Interaction,
    EmbedBuilder,
    time,
} from "discord.js";
import { Command } from "../Command";

export = {
	data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Пользователь !")
	.addUserOption(o => o.setName('member').setDescription('Участник')),
    async execute(interaction: CommandInteraction) {

        let iconURL: string = 'https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png'
		const int: CommandInteraction = interaction

		if(int.guild!=null && int.guild!=undefined) {
			let userO: any = int.user
			let member: any = int.member
			let serverGuildIcon: any = int?.guild.iconURL()
		if (int.options.getUser(`member`)) {
			const user: any = int.options.getUser(`member`)
			userO = int.options.getUser(`member`)
			member = int.guild.members.cache.get(user.id)
		}
			
			let totalRoles: any[] = member.roles?.cache
			let memberRoles = new Map();
			const guildUserRoles: any[] = []
	
			totalRoles?.forEach(role => {
				memberRoles.set(role.position, role.id)
			})
	
			const memberRolesSort = new Map([...memberRoles.entries()].sort((a, b) => b[0] - a[0]));
	
			memberRolesSort.forEach(roleId => {
				guildUserRoles.push(`\n<@&${roleId}>`)
			})
	
			await int.reply({
				content: `# :tophat:\n Собираем информацию...`,
				fetchReply: true, ephemeral: true
			})
	
			const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({name: int.guild?.name, iconURL: serverGuildIcon })
			.setTitle(`Об участнике ${member?.user.globalName}`)
			.setDescription(`Информация об участнике ${member?.user.username} на сервере ${int.guild?.name}`)
			.addFields(
				{	name: `Команда запущена:`,
				value: `${int.user} (${int.user.username})\n\n**Участник ${member?.user.username} присоединился:**\n${time(member?.joinedAt)}\nЭто:\n${time(member?.joinedAt, `R`)}
				\n**Пользователь в Discord: **\n${time(userO.createdAt)}\nЭто:\n${time(userO.createdAt, `R`)}`, inline: true	},
				{	name: `Роли участника:`, value: `${guildUserRoles}`, inline: true},
			)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
			.setTimestamp()
			.setFooter({ text: `${int.guild?.id} - ${int.guild?.name}`, iconURL: serverGuildIcon });
	
			int.editReply({
				content: ``,
				embeds: [embed], 
			}
			)} else {
				let user: any = int.user
				if(int.options.getUser(`member`)){
					user = int.options.getUser(`member`)
				}
				await int.reply({
					content: `# :tophat:\n Собираем информацию...`,
					fetchReply: true, ephemeral: true
				})
				await int.editReply({
					content: `# :tophat:\n Сервер не найден...`
				})
				const embed = new EmbedBuilder()
				.setColor(0x161618)
				.setAuthor({name: `The Void`, iconURL: `${iconURL}` })
				.setTitle(`Об участнике ${user.username}`)
				.setDescription(`Информация об участнике ${user?.globalName || user.username}`)
				.addFields(
					{name: `Команда запущена:`, value: `${int.user} (${int.user.username})`, inline: true	},
					{name: `Пользователь ${user.username} присоединился:`, value: `${time(user.createdAt)}\nЭто:\n${time(user.createdAt, `R`)}`, inline: true}
				)
				.setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
				.setTimestamp()
				.setFooter({ text: `The Void`, iconURL: `${iconURL}` });
				await int.editReply({
					embeds: [embed],
				})
            }
}}
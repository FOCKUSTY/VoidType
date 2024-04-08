import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { version } from '../../../../package.json';

export =
{
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Вы узнаете версию бота !')
		.setNameLocalizations({
			ru: 'версия',
			"en-US": 'vesion'
		})
		.setDescriptionLocalizations({
			ru: 'Вы узнаете версию бота',
			"en-US": 'You will find out the bot version'
		}),
	async execute(interaction: CommandInteraction)
	{
		return await interaction.reply({content: `Версия бота: ${version}`, ephemeral: true})
	},
};
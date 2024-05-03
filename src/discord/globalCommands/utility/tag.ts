import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDevelop } from 'dev@';

import { ideaType, statusMongoose as status } from 'databaseTypes'
import database from '@database';
const idea = database.mongooseDatabase.ideas

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('tag')
	.setDescription('тег')
    .setNameLocalizations({ru:'тег', "en-US":'tag'})
    .setDescriptionLocalizations({ru:'тег', "en-US":'tag'})
    .addSubcommand(subcommand =>
        subcommand.setName(`ideaname`).setDescription(`Найдет тег по названию идеи`)
        .setNameLocalizations({ru:'название-идеи',"en-US":'idea-name'})
        .setDescriptionLocalizations({ru:'Найдет тег по названию идеи',"en-US":'Find tag by idea name'})
        
        .addStringOption(option =>
            option.setName(`name`).setDescription(`Название тега (Идеи)`).setRequired(true))
            .setNameLocalizations({ru:'название',"en-US":'name'})
            .setDescriptionLocalizations({ru:'Название тега (Идеи)',"en-US":'Tag name (Idea name)'}))

    .addSubcommand(subcommand =>
        subcommand.setName(`ideas`).setDescription(`Вывести все идеи (Имени идей)`)
        .setNameLocalizations({ru:'идеи',"en-US":'ideas'})
        .setDescriptionLocalizations({ru:'Вывести все идеи (Имени идей)',"en-US":'Show all tags name'})),
    async execute(interaction: any)
    {

        const
            int = interaction,
            subcommand = interaction.options.getSubcommand(),
            iconURL = getDevelop('iconurl'),
            authorName = getDevelop('authorname');

        if(subcommand===`ideaname`)
        {
            const tagId = interaction.options.getString('name');
            
            await idea.getIdea('findOne', tagId).then(async (status: status) =>
            {
                if(!status.tag || typeof(status.tag) === 'string')
                    return await interaction.reply({content: `Не удалось найти тег: ${tagId}\n${status.error}`, ephemeral: true});

                const embed = new EmbedBuilder()
                    .setColor(0x161618)
                    .setAuthor({name: `${authorName}`, iconURL: `${iconURL}`})
                    .setTitle(`${status.tag.get('name')}`)
                    .setThumbnail(`${iconURL}`)
                    .setDescription(`${status.tag.get('description')}`)
                    .setTimestamp()
                    .setFooter({text: `${int.guild?.name||`Не на сервере`}`, iconURL: `${iconURL}`});

                return await interaction.reply({embeds: [embed], ephemeral: true})});
        }
        else if(subcommand===`ideas`)
        {
            await idea.getIdea('findAll').then(async (status: status) =>
            {
                const embed = new EmbedBuilder()
                .setColor(0x161618)
                .setAuthor({name: int?.guild.name||int.user.username, iconURL: `${int?.guild.iconURL()||int?.user.iconURL()}` })
                .setTitle(`Все идеи`)
                .setDescription(`${status.tag}`)
                .setTimestamp()
                .setFooter({text: `${int?.guild.name||int.user.username}`, iconURL: `${int?.guild.iconURL()||int?.user.iconURL()}`});
        
                return await interaction.reply({embeds: [embed], ephemeral: true})
            }).catch((err:any) => { console.error(err) });
        };
	},
};
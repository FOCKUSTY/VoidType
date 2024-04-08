import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUserTagOutDB } from '../../utils/tags';
import { getDevelop } from '../../utils/develop';

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
            iconURL = getDevelop('iconURL'),
            authorName = getDevelop('authorname');

        if(subcommand===`ideaname`)
        {
            const tagName = interaction.options.getString('name');
            
            getUserTagOutDB('findOne', tagName)
                .then(function(tag: any)
                {
                    const embed = new EmbedBuilder()
                        .setColor(0x161618)
                        .setAuthor({name: `${authorName}`, iconURL: `${iconURL}`})
                        .setTitle(`${tag.get('name')}`)
                        .setThumbnail(`${iconURL}`)
                        .setDescription(`${tag.get('description')}`)
                        .setTimestamp()
                        .setFooter({text: `${int.guild?.name||`Не на сервере`}`, iconURL: `${iconURL}`});

                    if (tag) return interaction.reply({embeds: [embed], ephemeral: true});
                    else return interaction.reply({content: `Не удалось найти тег: ${tagName}`, ephemeral: true});
                })
                .catch(function(err)
                {
                    console.log(err);
                    return interaction.reply({content: `Не удалось найти тег: ${tagName}`, ephemeral: true});
                });
        }
        else if(subcommand===`ideas`)
        {
            getUserTagOutDB('findAll')
                .then(function(tagnames)
                {
                    const embed = new EmbedBuilder()
                        .setColor(0x161618)
                        .setAuthor({name: int?.guild.name||int.user.username, iconURL: `${int?.guild.iconURL()||int?.user.iconURL()}` })
                        .setTitle(`Все идеи`)
                        .setDescription(`${tagnames}`)
                        .setTimestamp()
                        .setFooter({text: `${int?.guild.name||int.user.username}`, iconURL: `${int?.guild.iconURL()||int?.user.iconURL()}`});
                
                    return interaction.reply({embeds: [embed], ephemeral: true})
                })
                .catch(function(err)
                {
                    console.log(err);
                });

        };
	},
};
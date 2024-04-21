import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { addNewLogGuild, updateGuildLog } from 'd@utility/tags';

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('log')
	.setDescription('Логирование сообщений !')
    .setNameLocalizations({ ru:'логирование', "en-US":'log' })
    .setDescriptionLocalizations({ ru:'Логирование сообщений !', "en-US":'Message logging !' })

    .addSubcommand(s=>s.setName('add').setDescription('Добавить логирование')
        .setNameLocalizations({ru:'добавить',"en-US":'add'})
        .setDescriptionLocalizations({ru:'Добавить логирование',"en-US":'Add logging'})

        .addChannelOption(o=>o.setName('channel').setDescription('Назначьте канал для логирования')
        .setNameLocalizations({ru:'канал',"en-US":'channel'})
        .setDescriptionLocalizations({ru:'Назначьте канал для логирования',"en-US":'Assign a channel for logging'})
        .setRequired(true).addChannelTypes(ChannelType.GuildText))
    
        .addBooleanOption(o=>o.setName('msg-delete').setDescription('Логирование удаленных сообщений ?')
        .setNameLocalizations({ru:'удаление-сообщений',"en-US":'msg-delete'}).setRequired(true)
        .setDescriptionLocalizations({ru:'Логирование удаленных сообщение ?',"en-US":'Logging deleted messages?'}))
    
        .addBooleanOption(o=>o.setName('msg-update').setDescription('Логирование обновленных сообщений ?')
        .setNameLocalizations({ru:'обновление-сообщений',"en-US":'msg-update'}).setRequired(true)
        .setDescriptionLocalizations({ru:'Логирование обновленных сообщение ?',"en-US":'Logging updated messages?'})))

    
    .addSubcommand(s=>s.setName('change').setDescription('изменить логирование')
        .setNameLocalizations({ru:'изменить',"en-US":'change'})
        .setDescriptionLocalizations({ru:'Изменить логирование',"en-US":'Change logging'})
        
        .addChannelOption(o=>o.setName('channel').setDescription('Назначьте канал для логирования')
        .setNameLocalizations({ru:'канал',"en-US":'channel'})
        .setDescriptionLocalizations({ru:'Назначьте канал для логирования',"en-US":'Assign a channel for logging'})
        .setRequired(true).addChannelTypes(ChannelType.GuildText))
        
        .addBooleanOption(o=>o.setName('msg-delete').setDescription('Логирование удаленных сообщений ?')
            .setNameLocalizations({ru:'удаление-сообщений',"en-US":'msg-delete'}).setRequired(true)
            .setDescriptionLocalizations({ru:'Логирование удаленных сообщение ?',"en-US":'Logging deleted messages?'}))
    
        .addBooleanOption(o=>o.setName('msg-update').setDescription('Логирование обновленных сообщений ?')
            .setNameLocalizations({ru:'обновление-сообщений',"en-US":'msg-update'}).setRequired(true)
            .setDescriptionLocalizations({ru:'Логирование обновленных сообщение ?',"en-US":'Logging updated messages?'}))
    
        .addBooleanOption(o=>o.setName('enable').setDescription('Включить логирование?')
            .setNameLocalizations({ru:'включение',"en-US":'enable'}).setRequired(true)
            .setDescriptionLocalizations({ru:'Включить логирование ?',"en-US":'Turn on logging ?'}))),

    async execute(interaction: any)
    {
        const subcommand = interaction.options._subcommand;

        if(subcommand === 'change')
        {
            const guild = interaction.guild;
            const channel = interaction.options.get('channel');
    
            updateGuildLog(`${guild.id}`, interaction.options.get('msg-delete'), interaction.options.get('msg-update'), `${channel.id}`, interaction.options.get('enable-log'));
    
            return await interaction.reply({ content: `Изменен метод логирования !`, ephemeral: true });
        }
        else if(subcommand === 'add')
        {
            const guild = interaction.guild;
            const channel = interaction.options.get('channel');

            addNewLogGuild(`${guild.id}`, interaction.options.get('msg-delete'), interaction.options.get('msg-update'), `${guild.name}`, `${channel.id}`, true, true);

            await interaction.reply({ content: `Теперь я буду отправлять логи сообщений на Ваш сервер !`, ephemeral: true });
        };
	},
};
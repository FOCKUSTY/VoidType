import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';

import database from '@database';
import { logAttributes as logType, statusMongoose } from 'databaseTypes';
const logMessages = database.mongooseDatabase.logMessages;

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
            .setDescriptionLocalizations({ru:'Логирование обновленных сообщение ?',"en-US":'Logging updated messages?'}))

        .addBooleanOption(o=>o.setName('enable').setDescription('Включить логирование?')
            .setNameLocalizations({ru:'включение',"en-US":'enable'}).setRequired(true)
            .setDescriptionLocalizations({ru:'Включить логирование ?',"en-US":'Turn on logging ?'})))
    
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

        if(interaction.guild.ownerId != interaction.user.id)
            return await interaction.reply({content: 'У Вас не хватает прав', ephemeral: true});
        
        const guild = await interaction.guild;
        const channel = await interaction.options.get('channel');

        const data: logType =
        {
            guildId: await guild.id,
            
            options:
            {
                messages:
                {
                    data:
                    {
                        channelId: channel?.value,
                        
                        delete: interaction.options.get('msg-delete')?.value || false,
                        update: interaction.options.get('msg-update')?.value || false,

                        enabled: interaction.options.get('enable')?.value || false
                    }
                }    
            }
        };

        if(subcommand === 'change')
        {
            await logMessages.updateLogGuild(data).then(async(status: statusMongoose) =>
            {
                if(status.type === 'error')
                    return await interaction.reply({content: `Произошла какая-то ошибка\nОшибка: ${status.error}`, ephemeral: true})
                
                await interaction.reply({ content: `Изменен метод логирования !`, ephemeral: true });
            })

        }
        else if(subcommand === 'add')
        {
            await logMessages.addLogGuild(data).then(async(status: statusMongoose) =>
            {
                if(status.type === 'error')
                    return await interaction.reply({content: `Произошла какая-то ошибка\nОшибка: ${status.error}`, ephemeral: true})
                
                await interaction.reply({ content: `Теперь я буду отправлять логи сообщений на Ваш сервер !`, ephemeral: true });
            })

        };
	},
};
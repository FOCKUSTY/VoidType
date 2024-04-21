import { SlashCommandBuilder } from 'discord.js';
import { setBotReply, changeReplyTxt } from 'd@utility/botReply';
import { debug } from 'dev@console';

import config from 'config'

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('botreply')
	.setDescription('Включить/выключить ответ бота !')
    .setNameLocalizations({ru:'ответ-бота',"en-US":'bot-reply'})
    .setDescriptionLocalizations({ru:'Включение/выключение ответа бота',"en-US":'Turn bot reply on/off'})
    
    .addSubcommand(s=>s.setName('change').setDescription('Изменить записанное сообщение')
        .setNameLocalizations({ru:'изменить',"en-US":'change'})
        .setDescriptionLocalizations({ru:'Изменить записанное сообщение',"en-US":'Change recorded message'})
        
        .addStringOption(o=>o.setName('message').setDescription('Ваше сообщение').setRequired(true)
            .setNameLocalizations({ru:'сообщение',"en-US":'message'}).setDescriptionLocalizations({ru:'Ваше сообщение',"en-US":'Your message'})))
    
    .addSubcommand(s=>s.setName('option').setDescription('Включить/выключить ответ бота')
        .setNameLocalizations({ru:'значение',"en-US":'option'})
        .setDescriptionLocalizations({ru:'Включить/Выключить ответ бота',"en-US":'Turn bot reply off/on'})

        .addBooleanOption(o=>o.setName('switch').setDescription('Изменить значение ?').setRequired(true)
        .setNameLocalizations({ru:'изменить',"en-US":'switch'}).setDescriptionLocalizations({ru:'Изменить значение ?',"en-US":'Change option ?'}))),
    async execute(interaction: any)
    {
        const subcommand = interaction.options._subcommand;
        
        debug([interaction.options, subcommand], false);
        
        if(interaction.user.id != config.authorId)
            return await interaction.reply({content:'У Вас нет прав', ephemeral:true});

        if(subcommand === 'change')
        {
            const msg = interaction.options.get('message')?.value;
            changeReplyTxt(msg);
            
            await interaction.reply({ content: `Сообщение изменено на:\n${msg}`, ephemeral: true })
        }

        else if (subcommand==='option')
        {
            const op = interaction.options.get('switch')?.value;
            setBotReply(op);

            await interaction.reply({ content: `Зачение изменено на ${op}`, ephemeral: true });
        }
	},
};
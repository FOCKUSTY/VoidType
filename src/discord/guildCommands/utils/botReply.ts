import { SlashCommandBuilder } from 'discord.js';
import { setBotReply, changeReplyTxt } from '../../utils/botReply';

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
        .addBooleanOption(o=>o.setName('change').setDescription('Изменить значение ?').setRequired(true)
        .setNameLocalizations({ru:'изменить',"en-US":'change'}).setDescriptionLocalizations({ru:'Изменить значение ?',"en-US":'Change option ?'}))),
    async execute(interaction: any)
    {
        const subcommand = interaction.options.getSubcommand();
        
        if(interaction.user.id==='877154902244216852')
        {
            if(subcommand==='change')
            {
                const msg = interaction.options.getString('message');
                changeReplyTxt(msg);
                
                await interaction.reply({ content: `Сообщение изменено на:\n${msg}`, ephemeral: true })
            }
            else if (subcommand==='option')
            {
                const op = interaction.options.getBoolean('change');
                setBotReply(op);

                await interaction.reply({ content: `Зачение изменено на ${op}`, ephemeral: true });
            }
        }
        else await interaction.reply({content:'У Вас нет прав', ephemeral:true});  
	},
};
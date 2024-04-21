import { SlashCommandBuilder } from 'discord.js';
import { enableTalking } from 'd@logging/messageLog';

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('enable-talking')
	.setDescription('Команда, выключающая/включающая реагирование бота на Kristy !')
    .setNameLocalizations({
        ru:'выключатель-общения',
        "en-US":'enable-talking',
        ko:'대화-시작'
    })
    .setDescriptionLocalizations({
        ru:'Команда, выключающая/включающая реагирование бота на Kristy !',
        "en-US":'A command that disables/enables the bot\'s response to Kristy !',
        ko:'Kristy에 대한 봇의 응답을 비활성화/활성화하는 명령입니다 !'
    })
    
    .addBooleanOption(o=>o.setName('change').setDescription('Изменить значение ?').setRequired(true)
        .setNameLocalizations({
            ru:'изменить',
            "en-US":'change',
            ko:'변화'
        }).setDescriptionLocalizations({
            ru:'Изменить значение ?',
            "en-US":'Change option ?',
            ko:'값을 변경하시겠습니까 ?'
        })),

    async execute(interaction: any)
    {
        const isTalkingEnabled = enableTalking(interaction.options.get('change')?.value);

        if(isTalkingEnabled) await interaction.reply({content: `Значение изменено на: ${isTalkingEnabled}\nТеперь The Void реагирует на Kristy`, ephemeral: true})
        else await interaction.reply({content: `Значение изменено на: ${isTalkingEnabled}\nТеперь The Void не реагирует на Kristy`, ephemeral: true})
    }
};
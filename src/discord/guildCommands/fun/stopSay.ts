import { SlashCommandBuilder } from 'discord.js'
import { getBooleanChatting, setBooleanChatting } from 'd@utility/chatting'

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('stopsay')
	.setDescription('Команда остановки общения ботов !')
    .setNameLocalizations({
        ru:'остановить-общение',
        "en-US":'stop-say',
        ko:'통신을-중단하다'
    })
    .setDescriptionLocalizations({
        ru:'Команда останавливающая общение ботов !',
        "en-US":'Stop bot communication',
        ko:'봇 통신 중지 명령 !'
    }),
    async execute(interaction: any)
    {
        if(interaction.user.id != ('877154902244216852'||'827928352131252245'))
            return await interaction.reply({content:'У Вас нет прав', ephemeral: true})

        const booleanChatting = getBooleanChatting();

        if(booleanChatting)
        {
            setBooleanChatting(false);

            await interaction.reply({
                content: `Заканчиваю общение...`,
                ephemeral: true
            });
        }
        else
        {
            await interaction.reply({
            content: `Общение и так закончено`,
            ephemeral: true});
        };
	},
};
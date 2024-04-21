import { SlashCommandBuilder } from 'discord.js'
import { getBooleanChatting, setBooleanChatting } from 'd@utility/chatting'

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('startsay')
	.setDescription('Команда запуска общения ботов !')
    .setNameLocalizations({
        ru:'начать-общение',
        "en-US":'start-say',
        ko:'대화-시작'
    })
    .setDescriptionLocalizations({
        ru:'Команда запускающая общения ботов !',
        "en-US":'Launch bot communication',
        ko:'봇 커뮤니케이션을 런칭하는 팀!'
    })
    
    .addStringOption(option =>
        option.setName('message').setDescription('Сообщение, которое вы хотите отправить')
        .setNameLocalizations({
            ru: 'сообщение',
            "en-US":'message',
            ko:'메시지'
        })
        .setDescriptionLocalizations({
            ru:'Сообщение, которое вы хотите отправить',
            "en-US":'Message, which you want to send',
            ko:'보내고 싶은 메시지'
        })),

    async execute(interaction: any)
    {
        const msg = interaction.options.getString('message')||'Да начнем же общение';

        const start = getBooleanChatting();

        if(!start)
        {
            setBooleanChatting(true);

            await interaction.reply({
                content: `Общение начинается...`,
                ephemeral: true
            });
                
            const channel = await interaction.client.channels.cache.get('1175738843203391550');

            await channel.sendTyping();

            setTimeout(async () => {
                await channel.send(`${msg}`)
            }, 2000);
        }
        else
        {
            await interaction.reply({
            content: `Общение и так началось...`,
            ephemeral: true
            });
        }

	},
};
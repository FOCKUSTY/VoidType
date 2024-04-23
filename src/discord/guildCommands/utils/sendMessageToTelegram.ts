import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendMessage, status } from "t@utility/sendMessage";
import { Message } from 'telegraf/typings/core/types/typegram';
import config from 'config'

interface msg {
    msg: Message
};

export =
{
    data: new SlashCommandBuilder()
    .setName("send-message-to-telegram")
    .setDescription("Отправить сообщение в telegram !")
        .setNameLocalizations({ru:'отправить-сообщение-в-telegram',"en-US":'send-message-to-telegram'})
        .setDescriptionLocalizations({ru:'Отправить сообщение в telegram !',"en-US":'Send message to telegram !'})

    .addStringOption(o=>o.setName('chat-id').setDescription('Ваш чат Id')
        .setNameLocalizations({ru:'чат-id',"en-US":'chat-id'})
        .setDescriptionLocalizations({ru:'Ваш чат Id',"en-US":'Your chat Id'}))

    .addStringOption(o=>o.setName('message').setDescription('Ваш текст')
        .setNameLocalizations({ru:'сообщение',"en-US":'message'})
        .setDescriptionLocalizations({ru:'Ваш текст',"en-US":'Your text'})),
    
    async execute(interaction: CommandInteraction)
    {
        const text = interaction.options.get('message')?.value;
        const chatId: any = interaction.options.get('chat-id')?.value || '@BottomlessHat';
        
        if(interaction.user.id != config.authorId)
            return await interaction.reply({content: 'У Вас не хватает прав на использование данной команды', ephemeral: true})

        if(typeof(text) != 'string')
            return await interaction.reply({content: 'Произошла какая-то непредвиденная ошибка', ephemeral: true});

        await sendMessage({chatId: chatId, text: text}).then(async (data: status) =>
        {
            if(!data.data)
                return await interaction.reply({content: 'Произошла какая-то непредвиденная ошибка', ephemeral: true});

            if(data.type === 'error')
                await interaction.reply({content: `Произошла какая-то ошибка ${data.data}`, ephemeral: true});

            else
                await interaction.reply({content: `${data.text} в telegram в ${data.data.chat.id}\nСообщение: ${text}`, ephemeral: true});
        });
    }
};
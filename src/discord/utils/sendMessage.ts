import { EmbedBuilder, ActionRowBuilder, Client } from 'discord.js';
import { getDevelop, getDevelopClient } from "./develop";
import { status, Error } from 'databaseTypes';

type sendMessageData =
{
    channelId: string
    client?: Client;
    text: string;
}

const sendMessage = async (data: sendMessageData): Promise<status> =>
{
    try
    {
        if(!data?.client)
            data.client = getDevelopClient();

        const channel = data.client?.channels.cache.get(data.channelId);
        
        if(data.text.length >= 2000)
        {
            const iconURL = getDevelop('iconurl');

            const embed = new EmbedBuilder()
                .setAuthor({name: 'The Void', iconURL: iconURL})
                .setTitle('Change log')
                .setThumbnail(iconURL)
                .setDescription(data.text)
                .setTimestamp()
                .setFooter({text: 'The Void Community', iconURL: iconURL});

            if(channel?.isTextBased())
                channel.send({content: 'Небольшой список изменений', embeds: [embed]});
            else
                return new Error('Я не могу отправить сообщение на Ваш канал');
        }
        else
        {
            if(channel?.isTextBased())
                channel.send({content: data.text});
            else
                return new Error('Я не могу отправить сообщение на Ваш канал');
        }

        return {
            text: 'Успешно доставлено сообщение на ' + data.channelId,
            type: 'successed'
        };
    }
    catch (err)
    {
        console.log(err);
        
        return new Error(err);
    };
};

export
{
    sendMessage,
    sendMessageData
}
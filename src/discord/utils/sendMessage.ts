import { Client } from "discord.js";
import { getDevelopClient } from "./develop";
import { status, Error } from 'database/index';

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
        
        if(channel?.isTextBased())
            channel.send({content: data.text});
        else
            return new Error('Я не могу отправить сообщение на Ваш канал');

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
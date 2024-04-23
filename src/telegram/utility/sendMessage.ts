import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { getDevelopClient } from './develop';
import { oneTimeFunction } from 'src/discord/utils/OneTimeFunction';

let client: Telegraf;

type sendMessageData =
{
    client?: Telegraf;
    chatId: string | number;
    text: string;
};

type status =
{
    text: string;
    type: 'error'|'successed';

    data?: Message;
}

const sendMessage = async (data: sendMessageData): Promise<status> =>
{
    try
    {
        (async () =>
        {
            const developClient = getDevelopClient();
            client = developClient;
        })();

        let response: status = {text: '', type:'error'};
        let tClient: Telegraf;
    
        if(!data.client)
            tClient = await client;
    
        else
            tClient = await data.client;

        await tClient.telegram.sendMessage(data.chatId, data.text).then((thenData: Message) =>
        {
            if(!thenData)
                response = {
                    text: 'Сообщение не было отправлено',
                    type: 'error',
                    data: thenData
                };
    
            response = {
                text: 'Сообщение было отправлено',
                type: 'successed',
                data: thenData
            }
        });
    
        return response;
    }
    catch (err: any)
    {
        console.error(err);

        return {
            text: 'Произошла ошибка на стороне сервера',
            type: 'error',
            data: err
        };
    };
};

export
{
    sendMessage,
    status
};
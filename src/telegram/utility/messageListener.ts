import { addNewAccountToMultiplatform, updateAccountInMultiplatform, deleteAccountInMultiplatform, getMulityAccount } from 'utility/database';
import { check_I_HasUserInDiscord, getDiscordUser, sendMessageToUser, check_I_HasChannelInDiscord, color, sendMessage, responsiable } from 'd@utility/develop';
import { EmbedBuilder } from 'discord.js';
import { enterPassword } from 'utility/hashing'

const
    idMessages     = new Map(),
    readMessage    = new Map(),
    methods        = new Map(),
    messageCount   = new Map(),
    messageCache   = new Map(),
    readedMessages = new Map();

const endWords = new Map()
        .set('прекратить', true).set('остановить', true)
        .set('выключить', true).set('закончить', true);

const setMessageId = (channelId: string, messageId: string|null, messageAuthorId: string, method:any, replies:any, msgCount=1, types:any) =>
{
    method = method.toLowerCase();
    const newTypes = [];
    
    for(let type of types)
        newTypes.push([type[0].toLowerCase(), type[1].toLowerCase()]);

    idMessages.set(channelId, [messageId, messageAuthorId]);
    methods.set(`${messageAuthorId}//\\\\${channelId}`, [method, replies, newTypes]);
    readMessage.set(`${messageAuthorId}//\\\\${channelId}`, messageId);
    messageCount.set(`${messageAuthorId}//\\\\${channelId}`, [0, msgCount-1]);
};

const setMessage = ( chatId: string, authorId: string, message: any, type='пароль' ) =>
{
    const cache = messageCache.get(`${chatId}//\\\\${authorId}`) || new Map();

    if(type[0] != 'пароль')
    {
        cache.set(`${type[0]}`, `${message}`);
    
        messageCache.set(`${chatId}//\\\\${authorId}`, cache);
        readedMessages.set(`${chatId}//\\\\${authorId}`, message);
    }
    else if (type[0] === 'пароль')
    {
        const password = message;
        const hashedPassword = enterPassword(password);

        cache.set(`${type[0]}`, `${hashedPassword}`);
    
        messageCache.set(`${chatId}//\\\\${authorId}`, cache);
        readedMessages.set(`${chatId}//\\\\${authorId}`, message);
    };
};

const getMessage = ( chatId: string, authorId: string ) =>
{
    return readedMessages.get(`${chatId}//\\\\${authorId}`);
};

const getMessageCache = ( chatId: string, authorId: string ) =>
{    
    return messageCache.get(`${chatId}//\\\\${authorId}`);
};

const messageListener = async (message: any) =>
{
    const
        chat    = message.update.message.chat,
        from    = message.update.message.from,
        msg     = message.update.message,
        update  = message.update,
        
        msgInfo = [ msg.message_id, from.id ],
        msgInfoGetted = idMessages.get(chat.id),
        
        method = methods.get(`${from.id}//\\\\${chat.id}`),
        countOfMessages = messageCount.get(`${from.id}//\\\\${chat.id}`);

    if(endWords.get(`${msg.text}`.toLowerCase()))
        setMessageId(chat.id, null, from.id, null, null, 0, null);  
    
    if(readMessage.get(`${from.id}//\\\\${chat.id}`) === msg.message_id)
        setMessage(chat.id, from.id, msg.text, method[2][countOfMessages[0]]);

    if(method)
    {
        const data = getMessageCache(chat.id, from.id);
        let discordIdFromData: string = '', discordName: string = '';

        await getMulityAccount('findOne', 'telegramid', `${from.id}`).then((tag: any) =>
        {
            discordIdFromData = tag?.discordid;
            discordName = tag?.discordname;
        });

        if(discordIdFromData)
            data.set('discord id', discordIdFromData);

        if(countOfMessages[0] === countOfMessages[1])
            await sendMessageToUser(data.get('discord id'), 'Подтвердите Ваши действия в telegram').then(response => message.reply(response['text']) ); 
        
        else if(method[2][countOfMessages[0]][0] === '4-code')
        {
            const discordId = data.get('discord id');
            if(responsiable.get(discordId)[1] != msg.text)
                return await message.reply('Не правильный одноразовый четырех значный код');

            if(method[2][countOfMessages[0]][1] === 'multi')
            {
                const type = data.get('edittype').toLowerCase();
    
                await getDiscordUser(discordId).then(async (user: any) =>
                {                    
                    const dataOne: [string, string, string, string, string] = [from.id, discordId, from.username || `${from.last_name} ${from.first_name}`, user.user.username, data.get('пароль')] as const
                    const dataTwo: [string, string, string] = [from.id, discordId, data.get('пароль')] as const;

                    const timer = setTimeout(() =>
                    {
                        if(responsiable.get(discordId)[0])
                        {
                            if (type.indexOf('добавить') != -1) addNewAccountToMultiplatform(...dataOne).then(async response => await message.reply(response) );
                            else if(type.indexOf('изменить') != -1) updateAccountInMultiplatform(...dataOne).then(async response => await message.reply(response) );
                            else if(type.indexOf('удалить') != -1)  deleteAccountInMultiplatform(...dataTwo).then(async response => await message.reply(response) );
                        }
                    }, 2000);
                });
            }
            else if(method[2][countOfMessages[0]][1] === 'send')
            {
                let iconURL;

                await getDiscordUser(data.get('discord id'))
                    .then(async (user: any) => iconURL = `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png` );

                const embed = new EmbedBuilder()
                    .setAuthor({name:`${discordName}`, iconURL: `${iconURL}`})
                    .setTitle(`${`${from.username}` || `${from.last_name} ${from.first_name}`} отправил сообщение из telegram`)
                    .setColor(color)
                    .setDescription(`${data.get('message')}`)
                    .setTimestamp()

                const options = { embeds: [embed] };

                sendMessage(null, data.get('channel id'), options).then(response => message.reply(response));
            };
        }
    };

    if( !((msgInfo.toString() === msgInfoGetted?.toString()) && (msgInfo.length === msgInfoGetted.length)) )
        return;
    
    if( !msgInfoGetted )
        return;

    if(method[0] === 'one msg')
    {
        // Пока не придумал;
    }
    else if(method[0] === 'one+ msg')
    {
        if(countOfMessages[0] > countOfMessages[1])
            return;

        const reply = method[1][countOfMessages[0]];
        
        if(method[2][countOfMessages[0]][0] === 'discord id')
        {
            let isNext, isIAlreadyHasDiscordId = false;

            await getMulityAccount('findOne', 'telegramid', `${from.id}`).then(tag =>
            {
                if(tag)
                    isIAlreadyHasDiscordId = true
            });
            
            if(isIAlreadyHasDiscordId)
                isNext = true;

            if(!isNext)
                await check_I_HasUserInDiscord(`${msg.text}`).then(isHasDiscordId => isNext = isHasDiscordId );
            
            if(!isNext)
                return await message.reply('Я не смог найти Вас на своих серверах в Discord');
        }
        else if(method[2][countOfMessages[0]][0] === 'channel id')
        {
            let isNext = false;
    
            await check_I_HasChannelInDiscord(`${msg.text}`).then(isHasChannelId => isNext = isHasChannelId );
    
            if(!isNext)
                return await message.reply('Я не смог найти Ваш канал на своих серверах в Discord');
        }

        message.reply(reply);

        idMessages.set(chat.id, [msg.message_id+2, from.id]);
        readMessage.set(`${from.id}//\\\\${chat.id}`, msg.message_id + 2);
        messageCount.set(`${from.id}//\\\\${chat.id}`, [countOfMessages[0]+1, countOfMessages[1]]);
    }
};

export
{
    setMessageId,
    messageListener,
    
    setMessage,
    getMessage,
    getMessageCache,

    responsiable,
    readedMessages
}
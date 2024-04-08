import {
        token,
        channelWithKristyChattingId,
        authorId,
        logGuildId,
        logChannelId,
        kristyId,
        clientId,
        telegramToken
    } from '../../../../config.json'
import { msgPing } from '../msgPing'
import { chattingWithKristy } from '../chatting'
import { getLogGuild } from '../tags'
import { sendMessageLog } from '../messageLog'
import { checkMessageToRead } from '../develop'

let isTalkingEnabled = true;

const messageDeleteLog = (m: any, sendMessageLog: any,) =>
{
    getLogGuild('findAll')
    .then((guildId: any) =>
    {
        getLogGuild('findOne', guildId)
            .then(async (data: any) =>
            {
                if(data?.optionupdate && (data.guildid === m.guild.id) )
                {
                    await sendMessageLog(m, "update", undefined, `${data.guildid}`, `${data.channellogid}`)
                }
            });
    });

    sendMessageLog(m, "delete", undefined, logGuildId, logChannelId);
};
const messageUpdateLog = (m: any, nm: any, sendMessageLog: any) =>
{
	getLogGuild('findAll')
		.then((guildId: any) =>
		{
			getLogGuild('findOne', guildId)
				.then(async (data: any) =>
				{
					if(data?.optionupdate && (data.guildid === m.guild.id) )
					{
						await sendMessageLog(m, "update", nm, `${data.guildid}`, `${data.channellogid}`)
					}
				});
		});

	sendMessageLog(m, "update", nm, logGuildId, logChannelId);
};

let oldMessageContent: any;
let oldAuthorId: any;

const messageCreateLog = (message: { channel: { type: number; id: string; send: (arg0: string) => void; }; mentions: { users: { get: (arg0: string) => any; }; }; author: { bot: any; id: any; }; content: any; }) =>
{
    if(message.channel.type === 1)
	{
	}
	else
	{
		sendMessageLog(message, "send", undefined, logGuildId, logChannelId);
		
		if(message.mentions.users.get(`${authorId}`)) msgPing(message);
		if(isTalkingEnabled) if(message.channel.id===`${channelWithKristyChattingId}`) chattingWithKristy(message);

        if(!message.author.bot)
        {

            if(oldAuthorId != message.author.id)
            {
                if(
                    (`${oldMessageContent}`.toLowerCase() === `${message.content}`.toLowerCase())
                    &&
                    (`${oldMessageContent}`.toLowerCase().indexOf('понятно') != -1 && `${message.content}`.toLowerCase().indexOf('понятно') != -1)
                  ) message.channel.send('Понятно');

                  oldMessageContent = message.content;
                  oldAuthorId = message.author.id;
            }
        };
	};
}

const enableTalking = (value = true) =>
{
    isTalkingEnabled = value;
    return isTalkingEnabled;
}

export
{
    messageDeleteLog,
    messageUpdateLog,
    messageCreateLog,
    enableTalking
}
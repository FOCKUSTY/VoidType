import config from 'config';
import { msgPing } from '../msgPing'
import { chattingWithKristy } from '../chatting'
import { sendMessageLog } from '../messageLog'

import { statusMongoose as status, logAttributes } from 'databaseTypes'
import database from '@database';

const log = database.mongooseDatabase.log;

let isTalkingEnabled = true;

const messageDeleteLog = async (m: any, sendMessageLog: any) =>
{
    const guilds = await log.getLogGuild('findAll')
    const tags: logAttributes[] = guilds.tag;
    const logGuilds = tags.filter(data => data.options.messages?.data.delete && data.options.messages?.data.enabled);
    
    logGuilds.forEach(async (guildData) =>
        await sendMessageLog(m, 'delete', undefined, guildData.guildId, guildData.options.messages?.data.channelId));

    sendMessageLog(m, "delete", undefined, config.logGuildId, config.logChannelId);
};

const messageUpdateLog = (m: any, nm: any, sendMessageLog: any) =>
{
	log.getLogGuild('findAll')
		.then((guildId: any) =>
		{
			log.getLogGuild('findOne', guildId)
				.then(async (data: any) =>
				{
					if(data?.optionupdate && (data.guildid === m.guild.id) )
					{
						await sendMessageLog(m, "update", nm, `${data.guildid}`, `${data.channellogid}`)
					}
				});
		});

	sendMessageLog(m, "update", nm, config.logGuildId, config.logChannelId);
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
		sendMessageLog(message, "send", undefined, config.logGuildId, config.logChannelId);
		
		if(message.mentions.users.get(`${config.authorId}`))
            msgPing(message);
		
        if(isTalkingEnabled) if(message.channel.id===`${config.channelWithKristyChattingId}`)
            chattingWithKristy(message);

        if(message.author.bot || (oldAuthorId === message.author.id))
            return;

        if(
            (`${oldMessageContent}`.toLowerCase() === `${message.content}`.toLowerCase())
            &&
            (`${oldMessageContent}`.toLowerCase().indexOf('понятно') != -1 && `${message.content}`.toLowerCase().indexOf('понятно') != -1)
          ) message.channel.send('Понятно');

          oldMessageContent = message.content;
          oldAuthorId = message.author.id;
    }
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
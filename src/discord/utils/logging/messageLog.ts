const
    {
        token,
        channelWithKristyChattingId,
        authorId,
        logGuildId,
        logChannelId,
        kristyId,
        clientId,
        telegramToken
    } = require('../../../../config.json'),
    
    { msgPing } = require('../msgPing'),

    { chattingWithKristy } = require('../chatting'),

    { getLogGuild } = require('../dataBase'),

    { sendMessageLog } = require('../messageLog'),

    { checkMessageToRead } = require('../develop');

let isTalkingEnabled = true;

const messageDeleteLog = (m: { guild: { id: string; }; }, sendMessageLog: (arg0: any, arg1: string, arg2: undefined, arg3: string, arg4: string) => void) =>
{
    getLogGuild('findAll')
    .then((guildId: any) =>
    {
        getLogGuild('findOne', guildId)
            .then(async (data: { optionupdate: any; guildid: any; channellogid: any; }) =>
            {
                if(data?.optionupdate && (data.guildid === m.guild.id) )
                {
                    await sendMessageLog(m, "update", undefined, `${data.guildid}`, `${data.channellogid}`)
                }
            });
    });

    sendMessageLog(m, "delete", undefined, logGuildId, logChannelId);
};
const messageUpdateLog = (m: { guild: { id: any; }; }, nm: any, sendMessageLog: (arg0: any, arg1: string, arg2: any, arg3: string, arg4: string) => void) =>
{
	getLogGuild('findAll')
		.then((guildId: any) =>
		{
			getLogGuild('findOne', guildId)
				.then(async (data: { optionupdate: any; guildid: string; channellogid: string; }) =>
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
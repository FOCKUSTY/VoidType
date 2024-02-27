import { addUserTagToDB, getUserTagOutDB } from './tags';

const clientId = '1165358319419002890';
const TheVoidId = '1122199797449904179';
const ideaChannelId = '1171051517910986752';

export const readAllMessageFromIdeaChannel = async (client: any) =>
{

    const channel = await client.channels.fetch(`${ideaChannelId}`);

    channel.messages.fetch({ limit: 100 }).then(async (messages: any) =>
    {
        for(let message of messages)
        {
            message = message[1];

            if(message.author.id === clientId || message.author.id === TheVoidId)
            {

                if(message?.embeds)
                {
                    for(let embed of message.embeds)
                    {
                        let user;
    
                        const
                            data = embed.data,
                            title = data.title,
                            description = data.description,
                            username = data.author.name,
                            globalName = `${data.author.name} | Прочитано`,
                            guildName = message.guild;
    
                        await getUserTagOutDB('findOne', title)
                            .then(function(tag: any)
                            {
                                if(!tag) addUserTagToDB(title, user = {username: username, globalName: globalName}, description, guildName, false); 
                            });
                    };
                };
            };
        };
    })
};
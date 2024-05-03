import database from '@database'
import { ideaType, statusMongoose } from 'databaseTypes'
import config from 'config';

const { createIdea, getIdeaByName, getIdeaByOptions} = database.mongooseDatabase.ideas;

const ideaChannelId = '1171051517910986752';

export const readAllMessageFromIdeaChannel = async (client: any) =>
{
    const channel = await client.channels.fetch(`${ideaChannelId}`);

    channel.messages.fetch({ limit: 100 }).then(async (messages: any) =>
    {
        for(const msg of messages)
        {
            const message = msg[1];

            if(!(message.author.id != config.clientId || message.author.id != config.TheVoidId || message.author.id != config.TheAbyssiaId))
                continue;

            if(!message?.embeds)
                continue;

            for(let embed of message.embeds)
            {
                const
                    data = embed.data,
                    title = data.title,
                    description = data.description,
                    username = data.author.name,
                    globalName = `${data.author.name} | Прочитано`,
                    guildName = message.guild;
                
                const idea: ideaType =
                {
                    description: description,
                    globalname: globalName,
                    guildname: guildName,
                    ideaName: title,
                    username: username
                };
                
                const ideas: ideaType[] = (await getIdeaByName(title)).tag;

                if(ideas.length != 0 && !!ideas)
                {
                    const notAddedsIdea = ideas.filter((ideaData: ideaType) =>
                        ideaData.description != description);

                    notAddedsIdea.forEach(async () =>
                    {
                        const status = await getIdeaByOptions(idea);

                        if(status.type != 'successed' || status.tag.length === 0)
                            await createIdea(idea);
                    });
                }
                else
                    await createIdea(idea);
            };
        };
    })
};
import { Events, ActivityType, REST, Client, GuildMember } from 'discord.js';
import { getMTUOJ } from '../utils/messsageToUserOnJoin'

export =
{
    name: Events.GuildMemberAdd,
    once: false,
    async execute(data: GuildMember)
    {
        await getMTUOJ(data.guild.id).then(async (dbData: any) =>
        {
            if(dbData.type != 'successed' && !!dbData.text)
                return;
            
            try
            {
                await data.user.send({content: dbData.text.dataValues.text});
            }catch{};
        });
    }
};
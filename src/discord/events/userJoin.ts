import { Events, ActivityType, REST, Client, GuildMember } from 'discord.js';
import database from '@database';
import { statusMongoose as status } from 'databaseTypes'
const MTUOJ = database.mongooseDatabase.MTUOJ;

export =
{
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member: GuildMember)
    {
        await MTUOJ.getMTUOJ(member.guild.id).then(async (data: status) =>
        {
            if(data.type != 'successed' && !!data.text || !data.tag || typeof(data.tag) === 'string')
                return;
            
            try
            {
                await member.user.send({content: data.tag.text});
            }
            catch
            {
                return;
            };
        });
    }
};
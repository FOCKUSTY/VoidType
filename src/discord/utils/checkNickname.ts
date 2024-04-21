import { Client } from 'discord.js';
import { OneTime } from 'd@utility/OneTimeFunction';
import { config } from 'd@config';

let
    kristyMember: any,
    bottomlessHat: any;

const setKristyValues = (guild: any, kristy: any) =>
{
    kristyMember = kristy;
    bottomlessHat = guild;
};

const setKristy = new OneTime(false, 'setKristy')

const checkKristyNickname = async (client: Client, log=false) =>
{
    if(!client.user || !client.application) return;

    if(!setKristy.oneTimeFunction(true, true, true))
    {

        const guild = await client.guilds.fetch(`${config.bottomlessHatId}`);
        const kristy = await guild.members.fetch(`${config.kristyId}`);

        setKristyValues(guild, kristy);
        setKristy.oneTimeFunction(true, true, false);
    };

    if(kristyMember.nickname != '🎩Kristy')
    {
        let oldNickname = await kristyMember.nickname;
        await kristyMember.setNickname('🎩Kristy');
        if(log) console.log(`Псевдоним изменен с ${oldNickname} на ${kristyMember.nickname}`);
    }
    else if(log) console.log('Псевдоним нормальный');
};

export
{
    checkKristyNickname
}
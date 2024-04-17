import
{
	Interaction, InteractionType, EmbedBuilder, TextChannel,
	PermissionsBitField
} from "discord.js";

import { getRandomCode } from "../../utility/hashing";
import { responsiable } from "../utils/develop";
import { replyOnVCCButton } from '../utils/sendVoiceTools';

export =
{
    name: 'buttonsListener',
    async buttonsListener(this: any, int: Interaction)
    {
        const interaction = int;
        const client = int.client;
        const user = int.user;
        const userAvatar = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`;
        let iconURL;
    
        if(int.guild != undefined || int.guild != null)
            iconURL = `https://cdn.discordapp.com/icons/${int?.guild?.id}/${int?.guild?.icon}.png`;
    
        else
            iconURL = `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`;
    
        if(int.type === 3)
        {
            if(int.customId === 'confirm-telegram')
            {
                const code = getRandomCode(4);
                responsiable.set(`${int.user.id}`, [true, code]);
                
                await int.reply(`Спасибо, вот Ваш одноразовый четырех значный код: \`${code}\` !`);
            }
            else if(int.customId === 'cancel-telegram')
            {
                responsiable.set(`${int.user.id}`, false);
                
                await int.reply('Спасибо, извиняемся за беспокойство !');
            }
    
            else replyOnVCCButton(int)
        };
    }
}

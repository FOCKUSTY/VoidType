import { message } from 'telegraf/filters'
import { messageListener, setMessageId } from '../../utility/messageListener'

export =
{
    name: 'start',
    async execute(interaction: any)
    {
        await interaction.reply('Привет, пользователь. Посмотри, что я умею /help !');
    }
};
import
{
    SlashCommandBuilder,
    ModalActionRowComponentBuilder,
    CommandInteraction,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder, 
    ActionRowBuilder
} from 'discord.js';

import config from 'config';
import modals from 'src/discord/events/modals';
import { pseudoRandomNumber } from 'd@utility/pseudoRandom';
import { getActivities } from 'src/discord/utils/updatejson';

const objectIdeas = getActivities('objectIdeas');
const historyRandomObjectIdeas: any[] = [];

let placeholder: string = `Хочу, чтобы Валя был администратором на The Void Community!!!!`;

export =
{
    data: new SlashCommandBuilder()
    .setName("send-message-to-telegram")
    .setDescription("Отправить сообщение в telegram !")
        .setNameLocalizations({ru:'отправить-сообщение-в-telegram',"en-US":'send-message-to-telegram'})
        .setDescriptionLocalizations({ru:'Отправить сообщение в telegram !',"en-US":'Send message to telegram !'})

    .addStringOption(o=>o.setName('chat-id').setDescription('Ваш чат Id')
        .setNameLocalizations({ru:'чат-id',"en-US":'chat-id'})
        .setDescriptionLocalizations({ru:'Ваш чат Id',"en-US":'Your chat Id'})),
    
    async execute(interaction: CommandInteraction)
    {
        const chatId: any = interaction.options.get('chat-id')?.value || '@BottomlessHat';
    
        if(interaction.user.id != config.authorId)
            return await interaction.reply({content: 'У Вас не хватает прав на использование данной команды', ephemeral: true})

        const modal = new ModalBuilder().setCustomId('sendMessageToTelegramModal').setTitle('Ваше сообщение !');
        
        const randomNumber = pseudoRandomNumber(0, objectIdeas.length-1, 2, 2, historyRandomObjectIdeas, undefined, undefined, true, true, true);
        placeholder = objectIdeas[randomNumber]['ideaDetail'];


        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('message')
                    .setLabel("Ваше сообщение")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(2000)
                    .setPlaceholder(`${placeholder}`)
                )
        );

        modals.chatIds.set(interaction.user.id, chatId);

        return await interaction.showModal(modal);
    }
};
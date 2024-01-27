import
{
    SlashCommandBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    CommandInteraction,
    ModalActionRowComponentBuilder
} from 'discord.js';

import { bannedUsers } from '../../whiteList';
import { pseudoRandomNumber } from '../../utils/pseudoRandom';
import { getActivities } from '../../utils/updateActivities';

const objectIdeas = getActivities('objectIdeas');
const historyRandomObjectIdeas: any[] = [];
let booleanVar = false;

let ideaPH: string = `Добавить Валю в команду The Void Community`
let ideaDetailPH: string = `Хочу, чтобы Валя был администратором на The Void Community!!!!`

module.exports =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('idea')
	.setDescription('Предложить свою идею !')
    .setNameLocalizations({ru:'идея',"en-US":'idea'})
    .setDescriptionLocalizations({ru:'Предложить свою идею',"en-US":'Suggest your idea'}),
    async execute(interaction: CommandInteraction)
    {
        booleanVar = false;
        bannedUsers.forEach(async bannedUser => {
            if(interaction.user.id === bannedUser.id)
            {
                booleanVar = true;
                return await interaction.reply({content: `Вы находитесь в черном списке`, ephemeral: true})
            }
        })
        if(booleanVar===false)
        {
            const modal = new ModalBuilder()
                .setCustomId(`ideaModal`)
                .setTitle(`Ваша идея`);

            const randomNumber = pseudoRandomNumber(0, objectIdeas.length-1, 2, 2, historyRandomObjectIdeas, undefined, undefined, true, true, true);

            ideaPH = objectIdeas[randomNumber]['idea'];
            ideaDetailPH = objectIdeas[randomNumber]['ideaDetail'];

            modal.addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('ideaTitle')
                        .setLabel("Напишите Вашу идею")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                        .setPlaceholder(`${ideaPH}`)
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('ideaDetails')
                        .setLabel("Опишите идею в деталях")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(3000)
                        .setPlaceholder(`${ideaDetailPH}`)
                    )
            );
            await interaction.showModal(modal);
        };
	},
};
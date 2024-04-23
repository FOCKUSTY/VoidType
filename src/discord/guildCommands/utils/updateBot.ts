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
import { pseudoRandomNumber } from 'd@utility/pseudoRandom';
import { getActivities } from 'src/discord/utils/updatejson';
import modals from 'src/discord/events/modals';

const objectIdeas = getActivities('objectIdeas');
const historyRandomObjectIdeas: any[] = [];

let placeholder: string[];

export =
{
    data: new SlashCommandBuilder()
    .setName("write-change-log")
    .setDescription("Написать список изменений !")
    .setNameLocalizations({ru:'написать-change-log',"en-US":'write-change-log'})
    .setDescriptionLocalizations({ru:'Написать список изменений !',"en-US":"Write change log !"})
    
    .addStringOption(o=>o.setName('version').setDescription('Укажите версию')
        .setNameLocalizations({ru:'версия',"en-US":'version'}).setDescriptionLocalizations({ru:'Укажите версию',"en-US":'Write a version'})),
    
    async execute(interaction: CommandInteraction)
    {
        if(interaction.user.id != config.authorId)
            return await interaction.reply({content:'У Вас не хватает прав использовать данную команду', ephemeral:true});
        
        const version: string|number|boolean = interaction.options.get('version')?.value || 'error';

        const modal = new ModalBuilder().setCustomId('writeChangeLogModal').setTitle('Ваше сообщение !');
        const firstRandomNumber = pseudoRandomNumber(0, objectIdeas.length-1, 2, 2, historyRandomObjectIdeas, undefined, undefined, true, true, true);
        const secondRandomNumber = pseudoRandomNumber(0, objectIdeas.length-1, 2, 2, historyRandomObjectIdeas, undefined, undefined, true, true, true);

        placeholder = [objectIdeas[firstRandomNumber]['ideaDetail'], objectIdeas[secondRandomNumber]['ideaDetail']]

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('ru-changes')
                        .setLabel("Список изменение ru")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder(`${placeholder[0]}`)),
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('en-changes')
                        .setLabel("Список изменение en")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder(`${placeholder[1]}`)));

        modals.versions.set(interaction.user.id, version);

        return await interaction.showModal(modal);
    }
};
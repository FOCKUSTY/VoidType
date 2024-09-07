import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalActionRowComponentBuilder,
    CommandInteraction,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder, 
    ActionRowBuilder,
    ChannelType
} from 'discord.js';

import GetObject from 'utility/service/get-object.service';
import PseudoRandom from 'utility/service/pseudo-random.service';
import customIds from 'utility/modal/custom-ids.modal';

const history: number[] = [];

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('idea')
        .setDescription('Отправить свою идею!')
        .setNameLocalizations({ru:'идея',"en-US":'idea'})
        .setDescriptionLocalizations({ru:'Отправить свою идею',"en-US":'Send a your idea'}),
    async execute(interaction: CommandInteraction) {
        const components = customIds.ideaModal.components;
        const idea: { idea: string, ideaDetail: string }[] = GetObject('idea');

        const modal = new ModalBuilder().setCustomId(customIds.ideaModal.id).setTitle('Ваше сообщение !');
        const randomNumber = new PseudoRandom().Number(0, idea.length-1, history, idea);
        const placeholderTitle = idea[randomNumber].idea;
        const placeholderDescriptioin = idea[randomNumber].ideaDetail;

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.title)
                        .setLabel('Заголовок Вашей идеи')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMaxLength(256)
                        .setPlaceholder(placeholderTitle)
                ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.description)
                        .setLabel('Ваша идея (Описание)')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder(placeholderDescriptioin)
                )
        );

        await interaction.showModal(modal);
    }
};
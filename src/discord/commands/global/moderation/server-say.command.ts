import {
    ActionRowBuilder,
    CommandInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { config } from 'config';

import GetObject from 'utility/service/get-object.service';
import PseudoRandom from 'utility/service/pseudo-random.service';
import customIds from 'utility/modal/custom-ids.modal';

const history: any[] = [];

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('server-say')
	.setDescription('Сообщение с помощью бота!'),
    async execute(interaction: CommandInteraction)
    {
        if(interaction.user.id !== config.authorId)
            return await interaction.reply({ content: 'У Вас нет прав на использование этой команды', ephemeral: true })

        const components = customIds.sayModal.components;
        const idea = GetObject('idea');

        const modal = new ModalBuilder().setCustomId(customIds.sayModal.id).setTitle('Ваше сообщение !');
        const randomNumber = new PseudoRandom().Number(0, idea.length-1, history, idea);
        const placeholder = idea[randomNumber].ideaDetail;

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.sayMessage)
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder(placeholder)
                ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.sayChannel)
                        .setLabel('Ваш id канала')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMaxLength(30)
                )
        );

        await interaction.showModal(modal);
	},
};
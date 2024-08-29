import {
    SlashCommandBuilder,
    ModalActionRowComponentBuilder,
    CommandInteraction,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder, 
    ActionRowBuilder,
} from 'discord.js';

import { config } from 'config';

import customIds from 'utility/modal/custom-ids.modal';

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Сообщение с помощью бота!'),
    async execute(interaction: CommandInteraction)
    {
        if(interaction.user.id !== config.authorId)
            return await interaction.reply({ content: 'У Вас нет прав на использование этой команды', ephemeral: true });

        const components = customIds.updateModal.components;
        const modal = new ModalBuilder().setCustomId(customIds.updateModal.id).setTitle('Впишите обновления');

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.ruText)
                        .setLabel('Русский')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(3900)
                ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.enText)
                        .setLabel('Английский')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(3900)
                ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.version)
                        .setLabel('Версия')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMaxLength(30)
                )
        );

        await interaction.showModal(modal);
    }
};
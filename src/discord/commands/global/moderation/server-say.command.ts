import {
    ActionRowBuilder,
    CommandInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import PseudoRandom from 'utility/service/pseudo-random.service';
import { config } from 'config';
import { objects } from 'utility/loaders/objects.loader';
import customIds from 'utility/modal/custom-ids.modal';
import { booleans, channels } from 'utility/modal/say-message.modal';

const history: any[] = [];

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('serversay')
	.setDescription('Сообщение с помощью бота!')
    .addStringOption(o => o
        .setName('channel')
        .setNameLocalizations({
            ru: 'канал',
            "en-US": 'channel'
        })

        .setDescription('Id канала на который вы хотите отправить сообщение')
        .setDescriptionLocalizations({
            ru: 'Id канала на который вы хотите отправить сообщение',
            "en-US": 'The channel ID you want to send a message to'
        })

        .setRequired(true)
    )
    .addBooleanOption(o => o
        .setName('embed')
        .setNameLocalizations({
            ru: 'вложение',
            "en-US": 'embed'
        })

        .setDescription('Сообщение в виде embed? (Вложение)')
        .setDescriptionLocalizations({
            ru: 'Сообщение в виде embed? (Вложение)',
            "en-US": 'Message as embed?'
        })

        .setRequired(true)
    ),
    async execute(interaction: CommandInteraction)
    {
        const client = interaction.client;
        const channelId: any = interaction.options.get(`channel`)?.value;
        const bool: any = interaction.options.get('embed')?.value;
        const channel: any = client?.channels.cache.get(channelId);
        const components = customIds.sayModal.components;

        if(interaction.user.id !== config.authorId)
            return await interaction.reply({ content: 'У Вас нет прав на использование этой команды', ephemeral: true })

        if(!(channel.permissionsFor(interaction.client.user.id).has([
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel]))
        ) {
            return await interaction.reply({
                content:
                'Сообщение не было доставлено на Ваш канал, возможны причины:\n\
                Ваш канал не является текстовым каналом\n\
                У меня не достаточно прав отправить сообщение на Ваш канал',
                ephemeral: true
            });
        };
        
        booleans.set(interaction.user.id, bool);
        channels.set(interaction.user.id, channel);
        
        const modal = new ModalBuilder().setCustomId(customIds.sayModal.id).setTitle('Ваше сообщение !');
        const randomNumber = PseudoRandom.Number(0, objects.idea.length-1, history, objects.idea);
        const placeholder = objects.idea[randomNumber].ideaDetail;

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId(components.sayMessage)
                        .setLabel("Ваше сообщение")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(bool ? 4000 : 2000)
                        .setPlaceholder(placeholder)
                )
        );

        await interaction.showModal(modal);
	},
};
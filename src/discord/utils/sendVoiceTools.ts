import
  {
    ActionRowBuilder,
    
    ModalActionRowComponentBuilder,
    ModalBuilder,
    
    ButtonBuilder,
    EmbedBuilder,
    
    TextInputBuilder,
    
    ButtonStyle, TextInputStyle,
    VoiceChannel, Interaction, Channel,

    InteractionType,
    ChannelType

  } from 'discord.js';

import { pseudoRandomNumber } from './pseudoRandom';
import { getDevelopClient, getDevelop } from './develop';

const createdVCC = new Map();

const sendVoiceTools = async (channel: VoiceChannel) =>
{
    const client = await getDevelopClient();
    const iconURL = getDevelop('iconurl');

    const embed = new EmbedBuilder()
        .setAuthor({name: client.user.username, iconURL: iconURL})
        .setTitle('Это инструменты для управления Вашим голосовым каналом!')
        .setDescription('Снизу есть кнопки для Вашего удобства, просто жмите на них и будет выпадать модальное меню с инструкциями')
        .setTimestamp()
        .setFooter({text: 'The Void Commnunity', iconURL: iconURL});

    const components: ButtonBuilder[] =
    [
        new ButtonBuilder()
            .setCustomId('vcc-button-name')
            .setLabel('Название канала')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('vcc-button-member-count')
            .setLabel('Количество участников')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('vcc-button-block')
            .setLabel('Заблокировать чат?')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('vcc-button-hop') // hand over permisson - bhop
            .setLabel('Передать права другому?')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('vcc-button-return')
            .setLabel('Вернуть права?')
            .setStyle(ButtonStyle.Success),
    ];

    const row: any = new ActionRowBuilder()
        .addComponents(...components);

    createdVCC.set(channel.guildId, channel.id);

    await channel.send
    ({
        content: '',
        embeds: [embed],
        components: [row]
    });
};

const replyOnVCCButton = async (interaction: Interaction) =>
{
    if(interaction.type != 3)
        return;

    if(interaction.customId === 'vcc-button-name')
    {
        const modal = new ModalBuilder().setCustomId('vcc-modal-name').setTitle('Название канала');

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('vcc-tib-name').setRequired(true)
                        .setLabel('Название канала').setStyle(TextInputStyle.Short)
                        .setMaxLength(48).setMinLength(4)
                        .setPlaceholder('Адава кедавра')));
        
        await interaction.showModal(modal);
    }
    else if(interaction.customId === 'vcc-button-member-count')
    {
        const modal = new ModalBuilder().setCustomId('vcc-modal-member-count').setTitle('Количетсво участников');

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('vcc-tib-member-count').setRequired(true)
                        .setLabel('Количество участников').setStyle(TextInputStyle.Short)
                        .setMaxLength(2).setMinLength(1)
                        .setPlaceholder('0 - 99')));
        
        await interaction.showModal(modal);
    }
};

const replyOnVCCModal = async (interaction: Interaction) =>
{
    if(interaction.type != InteractionType.ModalSubmit)
        return;

    if(interaction.customId === 'vcc-modal-name')
    {
        const channel: Channel|undefined = interaction.client.channels.cache.get(createdVCC.get(interaction.guildId));

        if(!channel || channel.type != ChannelType.GuildVoice)
            return;

        const name: string = interaction.fields.getTextInputValue('vcc-tib-name');

        channel.setName(name);
        interaction.reply({content: `Название канала теперь: ${name}`, ephemeral: true})
    }
    else if(interaction.customId === 'vcc-modal-member-count')
    {
        const channel: Channel|undefined = interaction.client.channels.cache.get(createdVCC.get(interaction.guildId));

        if(!channel || channel.type != ChannelType.GuildVoice)
            return;

        const memberCount: string = interaction.fields.getTextInputValue('vcc-tib-member-count');

        channel.setUserLimit(Number(memberCount));
        interaction.reply({content: `Количество участников теперь: ${memberCount}`, ephemeral: true})
    };
};

export
{
    sendVoiceTools,

    replyOnVCCButton,
    replyOnVCCModal
}
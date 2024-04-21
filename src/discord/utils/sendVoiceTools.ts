import
  {
    ActionRowBuilder,
    
    ModalActionRowComponentBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    ModalBuilder,
    
    ButtonBuilder,
    EmbedBuilder,
    
    TextInputBuilder,
    
    ButtonStyle, TextInputStyle,
    VoiceChannel, Interaction, Channel,

    InteractionType,
    ChannelType,
    PermissionsBitField

  } from 'discord.js';

import { pseudoRandomNumber } from 'pseudo-random';
import { getDevelopClient, getDevelop } from 'dev@';

const createdVCC = new Map();
const usersBlocked = new Map();
const usersAdmin = new Map();
const chatBlocked = new Map();

const permissionsForUsers =
[
    PermissionsBitField.Flags.Stream,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.UseApplicationCommands,
    PermissionsBitField.Flags.AttachFiles,
];

const permissionsForUsersPLUS =
[
    ...permissionsForUsers,
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.SendMessages,
];

const permissionsForAdmin =
[
    PermissionsBitField.Flags.MuteMembers,
    PermissionsBitField.Flags.DeafenMembers,
    PermissionsBitField.Flags.KickMembers
];

const sendVoiceTools = async (channel: VoiceChannel, creatorId: string) =>
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
            .setCustomId('vcc-button-private')
            .setLabel('Поменять режим приватности')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('vcc-button-hop') // hand over permisson - bhop
            .setLabel('Передать права ?')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('vcc-button-user-block')
            .setLabel('(Раз)Заблокировать пользователя ?')
            .setStyle(ButtonStyle.Danger)
    ];

    const componentsPLUS: ButtonBuilder[] =
    [
        new ButtonBuilder()
        .setCustomId('vcc-button-chat-block')
        .setLabel('(Раз)Заблокировать чат ?')
        .setStyle(ButtonStyle.Danger)
    ]

    const row: any = new ActionRowBuilder()
        .addComponents(...components);

    const rowPLUS: any = new ActionRowBuilder()
        .addComponents(...componentsPLUS);

    createdVCC.set(channel.guildId, channel.id);
    usersAdmin.set(creatorId, true);

    await channel.send
    ({
        content: '',
        embeds: [embed],
        components: [row]
    });
    
    await channel.send
    ({
        content: '',
        embeds: [],
        components: [rowPLUS]
    });
};

const replyOnVCCButton = async (interaction: Interaction) =>
{
    if(interaction.type != 3)
        return;

    if(!usersAdmin.get(interaction.user.id))
        return await interaction.reply({content: 'У Вас не хватает прав', ephemeral: true});

    if(interaction.customId === 'vcc-button-name')
    {
        const modal = new ModalBuilder().setCustomId('vcc-modal-name').setTitle('Название канала');

        modal.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('vcc-tib-name').setRequired(true) // tib - TextInputBuilder
                        .setLabel('Название канала').setStyle(TextInputStyle.Short)
                        .setMaxLength(48).setMinLength(1)
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
                        .setCustomId('vcc-tib-member-count').setRequired(true) // tib - TextInputBuilder
                        .setLabel('Количество участников').setStyle(TextInputStyle.Short)
                        .setMaxLength(2).setMinLength(1)
                        .setPlaceholder('0 - 99')));
        
        await interaction.showModal(modal);
    }
    else if(interaction.customId === 'vcc-button-private')
    {
        const select = new StringSelectMenuBuilder()
            .setCustomId('vcc-sm-private') // ss - Select Menu
            .setPlaceholder('Выберите опцию !')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Заблокировать')
                    .setDescription('Никто не сможет зайти в чат')
                    .setValue('vcc-private-block'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Спрятать')
                    .setDescription('Никто не будет видеть чат')
                    .setValue('vcc-private-hide'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Спрятать и заблокировать')
                    .setDescription('Никто не будет видеть и не сможет зайти в чат')
                    .setValue('vcc-private-hide-and-block'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Выключить')
                    .setDescription('Выключить режим приватности')
                    .setValue('vcc-private-off')
            );

        const row: any = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({content:'Выберите режим приватности:', ephemeral:true, components: [row]})
    }
    else if(interaction.customId === 'vcc-button-hop')
    {
        const select = new UserSelectMenuBuilder()
        .setCustomId('vcc-sm-user') // ss - Select Menu
        .setPlaceholder('Выберите пользователя для передачи прав !')
        .setMinValues(1).setMaxValues(1)
        .setPlaceholder('Пользователь')

        const row: any = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({content:'Выберите пользователя:', ephemeral:true, components: [row]})
    }
    else if(interaction.customId === 'vcc-button-user-block')
    {
        const select = new UserSelectMenuBuilder()
        .setCustomId('vcc-sm-user-block') // sm - Select Menu
        .setPlaceholder('Выберите пользователя для (раз)блокировки')
        .setMinValues(1).setMaxValues(1)
        .setPlaceholder('Пользователь')

        const row: any = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({content:'Выберите пользователя:', ephemeral:true, components: [row]})
    }
    else if(interaction.customId === 'vcc-button-chat-block')
    {
        const channel: Channel|undefined = interaction.client.channels.cache.get(createdVCC.get(interaction.guildId));

        if(!channel || channel.type != ChannelType.GuildVoice || !interaction.guild)
            return await interaction.reply({content: 'Чат не найден или Вы в нем не находитесь', ephemeral: true});
    
        if(!chatBlocked.get(interaction.channelId))
        {
            chatBlocked.set(interaction.channelId, true);

            channel.edit
            ({
                permissionOverwrites:
                [
                    {
                        id: interaction.guild.id,
                        deny: permissionsForUsersPLUS,
                        allow: []
                    }
                ]
            })

            return await interaction.reply({content: 'Теперь чат заблокирован', ephemeral: true});
        }
        else
        {
            chatBlocked.set(interaction.channelId, false);

            channel.edit
            ({
                permissionOverwrites:
                [
                    {
                        id: interaction.guild.id,
                        deny: [],
                        allow: permissionsForUsersPLUS
                    }
                ]
            })

            return await interaction.reply({content: 'Теперь чат разблокирован', ephemeral: true});
        };
    }



    else
        replyOnVCCSelectMenu(interaction);
};

const replyOnVCCSelectMenu = async (interaction: Interaction) =>
{
    if(interaction.type != 3)
        return;

    if(!usersAdmin.get(interaction.user.id))
        return await interaction.reply({content: 'У Вас не хватает прав', ephemeral: true});

    const channel: Channel|undefined = interaction.client.channels.cache.get(createdVCC.get(interaction.guildId));

    if(!channel || channel.type != ChannelType.GuildVoice || !interaction.guild)
        return;

    if(interaction.isStringSelectMenu())
    {
        if(interaction.customId === 'vcc-sm-private')
        {
            if(interaction.values[0] === 'vcc-private-block')
            {
                channel.edit
                ({
                    permissionOverwrites:
                    [
                      {
                        id: interaction.guild.id,
                        deny: permissionsForUsersPLUS,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                      },
                    ]
                });

                await interaction.reply({content: "Настройка приватности успешна выполнена, теперь сюда не могут зайти", ephemeral: true})
            }
            else if(interaction.values[0] === 'vcc-private-hide')
            {
                channel.edit
                ({
                    permissionOverwrites:
                    [
                      {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                        allow: [...permissionsForUsers]
                      },
                    ]
                });

                await interaction.reply({content: "Настройка приватности успешна выполнена, теперь этот чат не видят", ephemeral: true})
            }
            else if(interaction.values[0] === 'vcc-private-hide-and-block')
            {
                channel.edit
                ({
                    permissionOverwrites:
                    [
                      {
                        id: interaction.guild.id,
                        deny: permissionsForUsersPLUS,
                        allow: [PermissionsBitField.Flags.UseApplicationCommands]
                      },
                    ]
                });

                await interaction.reply({content: "Настройка приватности успешна выполнена, теперь этот чат не видят и сюда нельзя зайти", ephemeral: true})
            }
            else if(interaction.values[0] === 'vcc-private-off')
            {  
                channel.edit
                ({
                    permissionOverwrites:
                    [
                      {
                        id: interaction.guild.id,
                        allow: permissionsForUsersPLUS
                      },
                    ]
                });

                await interaction.reply({content: "Настройка приватности успешна выполнена, всё вовзращено", ephemeral: true})
            };
        }
    }
    else if(interaction.isUserSelectMenu())
    {
        if(interaction.customId === 'vcc-sm-user')
        {
            const userId: string = interaction.values[0];
            const member = interaction.guild.members.cache.get(userId)

            if(!member)
                return await interaction.reply({content: 'Пользователь не найден', ephemeral: true})

            if(member.user.bot)
                return await interaction.reply({content: 'Выберите пользователя, а не бота', ephemeral: true})

            channel.edit
            ({
                permissionOverwrites:
                [
                    {
                        id: userId,
                        allow: permissionsForAdmin
                    }
                ]
            });

            usersAdmin.set(userId, true);

            return await interaction.reply({content: 'Права успешно переданы, в целях безопасности они у Вас тоже остались', ephemeral: true});
        }
        else if(interaction.customId === 'vcc-sm-user-block')
        {
            const userId: string = interaction.values[0];
            const member = interaction.guild.members.cache.get(userId)

            if(!member)
                return await interaction.reply({content: 'Пользователь не найден', ephemeral: true});

            if(member.user.bot)
                return await interaction.reply({content: 'Выберите пользователя, а не бота', ephemeral: true});

            if(!usersBlocked.get(userId))
            {
                channel.edit
                ({
                    permissionOverwrites:
                    [
                        {
                            id: userId,
                            deny: permissionsForUsersPLUS,
                            allow: []
                        }
                    ]
                });

                if(!usersAdmin.get(userId))
                    usersBlocked.set(userId, true);

                return await interaction.reply({content: `Пользователь ${member.user.globalName} заблокирован`, ephemeral: true});
            }
            else
            {
                channel.edit
                ({
                    permissionOverwrites:
                    [
                        {
                            id: userId,
                            allow: permissionsForUsersPLUS
                        }
                    ]
                });

                if(!usersAdmin.get(userId))
                    usersBlocked.set(userId, false);

                return await interaction.reply({content: `Пользователь ${member.user.globalName} разблокирован`, ephemeral: true});
            };
        };
    };
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

        if(Number.isNaN(Number(memberCount)))
            return await interaction.reply({content: `Введите числовое значение (От 0 до 99)`, ephemeral: true})

        channel.setUserLimit(Number(memberCount));
        await interaction.reply({content: `Количество участников теперь: ${memberCount}`, ephemeral: true})
    };
};

export
{
    sendVoiceTools,

    replyOnVCCButton,
    replyOnVCCModal
}
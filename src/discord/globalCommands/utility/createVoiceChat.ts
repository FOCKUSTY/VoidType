import { SlashCommandBuilder, ChannelType, PermissionsBitField } from "discord.js";

import database from '@database';
import { settedCreatorsVoiceChannelsAttributes as scvcType, statusMongoose as status } from 'databaseTypes'
const scvc = database.mongooseDatabase.settedCreatorsVoiceChannels;

const permissionsForBot = [ PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers ];

const permissions =
[
    PermissionsBitField.Flags.ManageGuild,
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.MoveMembers
]

export =
{
    data: new SlashCommandBuilder()
    .setName("voice-channel")
    .setDescription("Команда, дающая возможность управлять каналами-креаторами")
    .setNameLocalizations({"en-US":'voice-channel', ru:'голосовой-канал'})
    .setDescriptionLocalizations({"en-US":'A command that allows you to manage creative channels', ru:'Команда, дающая возможность управлять каналами-креаторами'})
    
    .addSubcommand(s=>s.setName('set').setDescription('установить')
        .addChannelOption(o=>o.setName('channel').setDescription('Ваш канал').addChannelTypes(ChannelType.GuildVoice)
        .setNameLocalizations({ru:'канал',"en-US":'channel'}).setRequired(true)
        .setDescriptionLocalizations({ru:'Ваш канал',"en-US":'Your chaneel'})))

    .addSubcommand(s=>s.setName('update').setDescription('обновить')
        .addChannelOption(o=>o.setName('channel').setDescription('Ваш канал').addChannelTypes(ChannelType.GuildVoice)
        .setNameLocalizations({ru:'канал',"en-US":'channel'}).setRequired(true)
        .setDescriptionLocalizations({ru:'Ваш канал',"en-US":'Your chaneel'})))

    .addSubcommand(s=>s.setName('delete').setDescription('удалить')),
    async execute(interaction: any)
    {
        if(!interaction.memberPermissions?.has(permissions)) 
            return await interaction.reply({content: 'У Вас нет прав использовать данную команду', ephemeral: true});

        if(!interaction.guild.roles.botRoleFor(interaction.client.application.id)?.permissions.has(permissionsForBot))
            return await interaction.reply({content: 'У меня нет прав создавать и изменять каналы', ephemeral: true});

        const channel = interaction.options.get('channel')?.channel;
        const subcommand = interaction.options._subcommand;

        if(!channel && subcommand != 'delete')
            return await interaction.reply({content: 'Канал указан не правильно', ephemeral: true});

        if(subcommand === 'set')
        {
            await scvc.addCreatorVoiceChannel({channelId: channel.id, guildId: interaction.guild.id}).then(async (status: status) =>
                await interaction.reply({content: `${status.error || status.text}`, ephemeral: true, embeds: []}));
        }
        else if(subcommand === 'update')
        {
            await scvc.updateCreatorVoiceChannel(channel.id, interaction.guild.id).then(async (status: status) =>
                await interaction.reply({content: `${status.error || status.text}`, ephemeral: true, embeds: []}));
        }
        else
        {
            await scvc.deleteCreatorVoiceChannel(interaction.guild.id).then(async (status: status) =>
                await interaction.reply({content: `${status.error || status.text}`, ephemeral: true, embeds: []}));
        };
    }
};
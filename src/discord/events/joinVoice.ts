import { Events, VoiceState, PermissionsBitField, ChannelType, VoiceChannel } from "discord.js";
import { sendVoiceTools } from '../utils/sendVoiceTools';

import database from '@database';
import { statusMongoose } from 'databaseTypes';

const getCreatorVoiceChannel = database.mongooseDatabase.settedCreatorsVoiceChannels.getCreatorVoiceChannel;

const permissionsForBot = [ PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers ];
const permissionsForUsers =
[
  PermissionsBitField.Flags.ViewChannel,
  PermissionsBitField.Flags.Connect,
  PermissionsBitField.Flags.SendMessages,
  PermissionsBitField.Flags.Stream,
  PermissionsBitField.Flags.Speak,
  PermissionsBitField.Flags.UseApplicationCommands,
  PermissionsBitField.Flags.AttachFiles,
];

const permissionsForCreator =
[
  PermissionsBitField.Flags.MuteMembers,
  PermissionsBitField.Flags.DeafenMembers,
  PermissionsBitField.Flags.KickMembers
];

const createdVCC = new Map();

export =
{
  name: Events.VoiceStateUpdate,
  async execute(oldVS: VoiceState, vs: VoiceState)
  {
    if(vs.member?.user.bot)
      return;

    if(createdVCC.has(vs.channelId) || createdVCC.has(oldVS.channelId))
    {
      if(typeof(createdVCC.get(vs.channelId)) === typeof(0))
      {
        createdVCC.set(vs.channelId, vs.channel?.members.size);
      }
      else if((oldVS.channel?.members.size == undefined || oldVS.channel.members.size == 0))
      {
        createdVCC.set(oldVS.channelId, 0);
        oldVS.channel?.delete();
      };
    };

    if(!vs.member?.voice.channel || !vs.channelId)
      return;

    let parent = vs.channel?.parent;

    await getCreatorVoiceChannel('findOne', vs.guild.id).then(async (data: statusMongoose) =>
      {
        if(data.type === 'error' || data.error || !data.tag || !vs.member)
          return;

        if(!vs.guild.roles.botRoleFor(vs.client.application.id)?.permissions.has(permissionsForBot))
          return;

        vs.guild.channels.create
        ({
          name: `Канал ${vs.member.user.globalName}`,
          type: ChannelType.GuildVoice,
          permissionOverwrites:
          [
            {
              id: vs.guild.id,
              allow: permissionsForUsers
            },
            {
              id: vs.member.user.id,
              allow: permissionsForCreator
            }
          ],
        }).then(async (channel: VoiceChannel) =>
          {
            if(!vs.member)
              return;

            vs.member?.voice.setChannel(channel.id);
            
            createdVCC.set(channel.id, vs.channel?.members.size);

            if(parent)
              channel.setParent(parent);

            await sendVoiceTools(channel, vs.member.id);
          });
      });
  }
};
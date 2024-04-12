import { Events, VoiceState, PermissionsBitField, ChannelType, VoiceChannel } from "discord.js";
import { getVoiceCreateChannel } from '../utils/tags';
import { sendVoiceTools } from '../utils/sendVoiceTools';


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
      return vs.member?.voice.disconnect();

    if(createdVCC.has(vs.channelId) || createdVCC.has(oldVS.channelId))
    {
      if(typeof(createdVCC.get(vs.channelId)) === typeof(0))
      {
        console.log(createdVCC.get(vs.channelId));
        createdVCC.set(vs.channelId, vs.channel?.members.size);
      }
      else if(typeof(createdVCC.get(oldVS.channelId)) === typeof(0) && oldVS.channel?.members.size == 0)
      {
        createdVCC.set(oldVS.channelId, 0);
        oldVS.channel?.delete();
      };
    };

    if(!vs.member?.voice.channel || !vs.channelId)
      return;

    let parent = vs.channel?.parent;

    await getVoiceCreateChannel({guildId: vs.guild.id, findType: 'findOne'}).then(async (data: any) =>
      {
        if(
            (!data.text || data?.type != 'successed' || !vs.member)
            ||
            (data.text?.dataValues && vs.channel?.id != data.text.dataValues.channelid)
          )
          return;

        if(!vs.guild.roles.botRoleFor(vs.client.application.id)?.permissions.has(permissionsForBot))
          return console.error(`У бота не хватает прав создать канал в ${vs.guild.name} (${vs.guild.id})`);

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
              id: vs.member.id,
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

            await sendVoiceTools(channel);
          });
      });
  }
};
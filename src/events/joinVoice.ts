import
{
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel
} from "@discordjs/voice";

import { Events, VoiceState } from "discord.js";
import { featureUsers } from "../whiteList";
import path from 'path';

const TheAbissia = '1165358319419002890'
const TheVoid = `1122199797449904179`;
const Kristy = `1164228812217790565`;

let booleanVar: boolean = false;
let user;

module.exports =
{
  name: Events.VoiceStateUpdate,
  async execute(oldVS: VoiceState, vs: VoiceState)
  {
  
    if (vs?.member?.id===Kristy) return;
    booleanVar = false;
    if (vs?.member?.id===TheAbissia) return;
    if (vs?.member?.id===TheVoid) return;
    if(!(oldVS.channel===undefined||oldVS.channel===null)) return;

    featureUsers.forEach((featureUser: {id: string, name: string}) =>
    {
      if(vs.member?.id === featureUser.id)
      {
          booleanVar = true;
          user = featureUser.name;
          return;
      }
    });

    if (!booleanVar) return;

    if (oldVS.channelId === null) setTimeout(() => {connectionHelper(vs)}, 1000); 
    else if (vs.channelId === null) setTimeout(() => {connectionHelper(oldVS, true)}, 1000);
    else if (!(vs.channelId === oldVS.channelId))
    {
      setTimeout(() =>
      {
        connectionHelper(oldVS, true);
        connectionHelper(vs);
      }, 1000);
    };
  },
};

const connectionHelper = (vs: VoiceState, off?: boolean) =>
{
  if (vs.guild.id && vs.channel?.id)
  {
    const player = createAudioPlayer({
      behaviors:
      {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

  const con = getVoiceConnection(vs.guild.id);
  if(con === undefined) {}
  else
  {
      player.on(AudioPlayerStatus.Idle, () =>
      {
        if (vs?.member?.id === TheAbissia) return;
        if (vs?.member?.id === TheVoid) return;
        player.stop()
        con.disconnect();
        return;
      });
  };

  player.play(createAudioResource(path.join(__dirname, "../../../VoidMusic/sounds/nea.mp3")));

  player.on('error', error =>
  {
    console.error(error);
  });

  player.on(AudioPlayerStatus.Idle, () =>
  {
    player.stop();
    connection.disconnect();
  });
  
  const connection = joinVoiceChannel({
    channelId: vs?.channel?.id,
    guildId: vs?.channel?.guild.id,
    adapterCreator: vs?.channel?.guild.voiceAdapterCreator,
  });

  if(booleanVar!=false) booleanVar=false

  connection.subscribe(player);
  if (off === true)
  {
    if (player) player.stop()
    if (connection) connection.disconnect()
  }
  }
}
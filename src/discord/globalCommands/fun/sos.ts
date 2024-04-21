import { joinVoiceChannel, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';
import { SlashCommandBuilder } from 'discord.js';
import { Random } from "random-js";

import path from 'path';

const random = new Random();

const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
});

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('sos')
	.setDescription('Сигнал сос !')
    .setNameLocalizations({ru:'сос',"en-US":'sos'})
    .setDescriptionLocalizations({ru:'Сигнал сос',"en-US":'Sos signal'}),
    async execute(interaction: any)
    {
                
        const
            int = interaction,
            user = int.user,
            member = interaction.guild?.members.cache.get(user.id),
            voice = member?.voice,
            channel = interaction?.member.voice.channelId;

        if (!channel) return await interaction.reply({content: 'Вы не находитесь в голосовом канале', ephemeral: true});
        else
        {
            setTimeout(() =>
            {
                const connection = joinVoiceChannel({
                    channelId: voice.channel.id,
                    guildId: voice.channel.guild.id,
                    adapterCreator: voice.channel.guild.voiceAdapterCreator,
                });
            
                player.play(createAudioResource(path.join(`../../../voidMusic/morse/sos.wav`)));
                
                connection.subscribe(player);
                
                player.on('error', (error: any) => { console.error('Error:', error.message, 'with track', error.resource.metadata.title) });
                
                player.on(AudioPlayerStatus.Idle, () =>
                {
                    player.stop()
                    connection.disconnect();
                });
            }, 1000);

        await interaction.reply({ content: `Воспроизводиться сигнал сос !`, ephemeral: true });
        };

	},
};
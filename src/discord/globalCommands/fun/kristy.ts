import { joinVoiceChannel, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior } from '@discordjs/voice'
import { SlashCommandBuilder } from 'discord.js'

import path from 'path'

const player = createAudioPlayer({
    behaviors:
    {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
});

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('kristy')
	.setDescription('Кристи команда !')
    .setNameLocalizations({ru:'кристи',"en-US":'kristy'})
    .setDescriptionLocalizations({ru:'Кристи команда',"en-US":'Kristy command'})
    
    .addSubcommand((s: any) => s.setName('voice').setDescription('Воспроизведет звук')
    .setNameLocalizations({ru:'голос',"en-US":'voice'}).setDescriptionLocalizations({ru:'Воспроизведет звук',"en-US":'Play sound'})),

    async execute(interaction: any)
    {
        const subcommand = interaction.options.getSubcommand()
        
        if(subcommand==='voice')
        {
    
            const
                int = interaction,
                user = int.user,
                member = interaction.guild?.members.cache.get(user.id),
                voice = member?.voice,
                channel = interaction?.member.voice.channelId
                
            if (!channel) interaction.reply({content: 'Вы не находитесь в голосовом канале', ephemeral: true});
            else
            {
            setTimeout(() =>
            {
                const connection = joinVoiceChannel({
                    channelId: voice.channel.id,
                    guildId: voice.channel.guild.id,
                    adapterCreator: voice.channel.guild.voiceAdapterCreator,
                });
    
                player.play(createAudioResource(path.join(`../../../../../VoidMusic/morse/kristyLove.wav`)));
                
                connection.subscribe(player);
                
                player.on('error', (error: any) =>
                {
                    console.error('Error:', error.message, 'with track', error.resource.metadata.title);
                });
            
                player.on(AudioPlayerStatus.Idle, () =>
                {
                    player.stop()
                    connection.disconnect();
                });
            }, 1000);

            await interaction.reply({
            content: `Воспроизводиться код морзе !`,
            ephemeral: true});
        }}
	},
};
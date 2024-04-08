import { SlashCommandBuilder } from 'discord.js';
import
{
    joinVoiceChannel,
    getVoiceConnection,
    AudioPlayerStatus,
    createAudioResource,
    createAudioPlayer,
    NoSubscriberBehavior
} from '@discordjs/voice';
    
import { pseudoRandomNumber } from '../../utils/pseudoRandom';
import { getDevelop } from '../../utils/develop';
import { setGMPlaying, getGMPlaying } from '../../utils/music';

import path from 'path';
import fs from 'node:fs';

const player = createAudioPlayer({
    behaviors:
    {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
}),
    
    musicHistory: any[] = [],
    queue: any[] = [];

let
    con: any,
    functionPlay: any,
    guildName: string;

function setPlay(func: any) { functionPlay = func };
function getPlay() { return functionPlay };

function setConnection(connection: any) { con = connection };
function getConnection() { return con };

function setName(int: any) { guildName = int.guild.name }
function getName() { return guildName }

player.on('error', error => { console.error(error) });
player.on(AudioPlayerStatus.Idle, () =>
{
    player.stop();
    if(queue.length>1)
    {
        queue.shift();
        getPlay()();
    }
    else
    {
        getConnection().disconnect();
        setGMPlaying(`${getName()}`, false);
    }
});

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('voice')
	.setDescription('Присоединиться в голосовой канал !')
    .setNameLocalizations({ru:'голосовой',"en-US":'voice'})
    .setDescriptionLocalizations({ru:'Присоединиться в голосовой канал',"en-US":'Join voice channel'})

    .addSubcommand(s =>s.setName(`play`).setDescription(`Проиграть музыку`)
        .setNameLocalizations({ru:'возпроизвести',"en-US":'play'}).setDescriptionLocalizations({ru:'Проиграть музыку',"en-US":'Play music'})
        .addBooleanOption(o=>o.setName('repeat').setDescription('Повторять ?')
            .setNameLocalizations({ru:'повторение',"en-US":'repeat'}).setDescriptionLocalizations({ru:'Повторять ?',"en-US":"Repeat ?"}))
        
        .addIntegerOption(o=>o.setName('count-repeat').setDescription('Количество повторений')
            .setNameLocalizations({ru:'кол-во-повторений'}).setDescriptionLocalizations({ru:'Количество повторений',"en-US":'Repeat count'})))
    .addSubcommand(s =>s.setName(`disconnect`).setDescription(`Выйти из голосового канала`)
        .setNameLocalizations({ru:'отсоединиться',"en-US":'disconnect'}).setDescriptionLocalizations({ru:'Выйти из голосового канала',"en-US":'Exit voice channel'})),
    async execute(interaction: any)
    {
        try
        {
            const formatFiles = [".mpeg", ".mp3", ".mp4", ".opus", '.weba', '.m4a'];
            const musicsPath = path.join(__dirname, '../../../../../VoidMusic/music');
            const developEmbed = getDevelop('developEmbed');
            const musics: any[] = [];            
            const int = interaction;
            const user = int.user;
            const member = interaction.guild?.members.cache.get(user.id);
            const subcommand: any = int.options._subcommand;
            const voice = member?.voice;
    
            let count = 0;
    
            function check()
            {
                musics.length = 0;
                for (let i = 0; i < formatFiles.length; i++)
                {
                    fs.readdirSync(musicsPath).filter(file => file.endsWith(formatFiles[i])).forEach(e =>
                    {
                        musics.push(e);
                    });
                };
            };
            check();
    
            if(subcommand==='play')
            {
                if(getGMPlaying(`${interaction.guild.name}`)) return await interaction.reply({ content:'Музыка уже воспроизводится на этом сервере', ephemeral: true });
                
                const isRepeat = int.options.get('repeat')?.value || false;
                const repeatCount = int.options.get('count-repeat')?.value || 1;
                const channel = interaction?.member.voice.channelId;
                setName(int);
    
                if(isRepeat && repeatCount!=1) for (let i = 0; i<repeatCount; i++) queue.push(pseudoRandomNumber(0, musics.length-1, 8, 1, musicHistory, undefined, undefined, true, true, true))
                else queue.push(pseudoRandomNumber(0, musics.length-1, 8, 1, musicHistory, undefined, undefined, true, true, true))

                if (!channel) return await interaction.reply( { content: 'Вы не находитесь в голосовом канале', ephemeral: true } );
    
                const connection = joinVoiceChannel({
                    channelId: voice.channel.id,
                    guildId: voice.channel.guild.id,
                    adapterCreator: voice.channel.guild.voiceAdapterCreator,
                });
    
                setGMPlaying(`${int.guild.name}`, true);
    
                function play()
                {
                    if( !( count % 5 ) ) check();
                    count+=1;
                    
                    console.log(`Сейчас играет: ${musics[queue[0]]} (Индекс: `+`${queue[0]} из ${musics.length})\nНа сервере ${int.guild.name}\n`);
                    player.play(createAudioResource(path.join(`${musicsPath}\\${musics[queue[0]]}`)));
                    // player.play(createAudioResource(path.join(`../../../VoidMusic/sounds/nea.mp3`)));
    
                    connection.subscribe(player);
                };
    
                setConnection(connection);
                setPlay(play);
    
                await interaction.reply({ content: 'Данная команда находится в разработке', embeds: [developEmbed], ephemeral: true });
                
                play();
            }
            else
            {
                const connection = getVoiceConnection(voice.guild.id);
                
                if(connection===undefined) await int.reply({content: `Нет подключения к голосовому каналу`, ephemeral: true})
                
                else
                {
                    player.stop();
                    connection.disconnect();
                    setGMPlaying(`${int.guild.name}`, false);
                    await int.reply({ content: `Успешно отключено от голосового канала`, ephemeral: true });
                };
            
            }
        }
        catch (err)
        {
            console.log(err)
        }
    }
    
}
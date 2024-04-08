import { EmbedBuilder } from 'discord.js';
import { getBotReply, readReplyTxt } from './botReply';
import { dateCheck } from './date';
import { color } from './develop';

async function msgPing(m: any)
{
    if(m.author.bot) return;
    if(!getBotReply()) return;
    if(!m.mentions) return;
    if(!m.mentions.users.has('877154902244216852')) return;
    if(m.author.id==='877154902244216852') return;
    
    const message = readReplyTxt();
    const fock = await m.client.users.cache.get('877154902244216852');
    const timestamp = Date.now();
  
    console.log(
        `----------------- Вам написали сообщение ! -----------------
        Контент: ${m.content}
        Автор: ${m.author.username} (${m.author.globalName}) - ${m.author.id}
        В чате: ${m.channel?.name} (${m.channel?.url})
        На сервере: ${m.guild?.name||'Не на сервере'}
        Время: ${dateCheck(timestamp)||'Не на сервере'}`
        );
  
    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({name: `${m.author?.globalName||m.author?.username}`, iconURL:`${m.author?.avatarURL()}`})
        .setTitle('Сообщение:')
        .setDescription(`${m.content}`)
        .setTimestamp()
        .setThumbnail(`${m.author.avatarURL()}`)
        .setFields(
            {name:`Чат:`, value:`[${m.channel.name}](<${m.channel.url}>)`, inline:true},
            {name:`Автор:`, value:`${m.author}`,inline:true},
            {name:`Время`, value:`${dateCheck(timestamp)}`, inline:true}
        )
        .setFooter({text:`${m.guild?.name}`, iconURL:`${m.guild.iconURL()}`})

    try
    {

        fock.send( { content: `<@877154902244216852> Вам написали сообщение !`, embeds: [ embed ] } );

        m.author.send({ content: `<@${ m.author.id }> ${ message }`}).catch((e: any) =>
            {
                m.reply( { content: `<@${ m.author.id }> ${ message }`, ephemeral: true } );
            }).catch((err: any) => {
                console.log( err )
            });

    }
    catch ( err )
    {
      console.log( err );
    }
};

export
{
    msgPing
}
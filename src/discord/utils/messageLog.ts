import { EmbedBuilder } from 'discord.js';
import { skip, debug } from './developConsole';
import { logChannelId, logGuildId } from '../../../config.json';
import { getDevelop } from './develop'

const sendMessageLog = async ( m: any, reason: string, m2: any, guildId = logGuildId, channelId = logChannelId ) =>
{
    if (m.author.bot) return;
    
    let
        attachmentName,
        attachmentUrl,
        attachmentProxyUrl,
        color: any,
        description = '';
    
    const guild = await m.client.guilds.fetch(guildId)
    
    m.attachments.forEach((attachment: { name: any; url: any; proxyURL: any; }) =>
        {
            attachmentName = attachment.name;
            attachmentUrl = attachment.url;
            attachmentProxyUrl = attachment.proxyURL;
        });
    
    switch (reason)
    {
      case "send":
        reason = "отправлено";
        color = "#7fdf7f";
        break;
    
      case "update":
        reason = "обновлено";
        color = "#7f7f7f";
        break;
    
      case "delete":
        reason = "удалено";
        color = "#df7f7f";
        break;
    
      default:
        reason = "||`{ошибка в коде}`||"
        color = "#7f7f7f"
        break;
    }
    
    let
        msg: string,
        msg2: string;
      
    if(m)
    {
        msg = m.content.replaceAll('```', '<code>').replaceAll(`\``, '"');
        description += `\`\`\`${msg}\`\`\``;
    };
    
    if(m2)
    {
        msg2 = m2.content.replaceAll('```', '<code>').replaceAll(`\``, '"');
        description += `\n\`\`\`${msg2}\`\`\``;
    };

    const fields = [];

    if (m?.attachments?.size > 0)
    {
        fields.push({
            name: `${m2 ? "Старые в" : "В"}ложения`,
            value: m.attachments
                .map((att: { url: any; }) => `\`\`\`${att.url}\`\`\``)
                .join(`\n&&\n`),
            inline: false,
        });
    };

    if (m2?.attachments?.size > 0)
    {
        fields.push({
            name: "Новые вложения",
            value: `${m2.attachments
                .map((att: { url: any; }) => `\`\`\`${att.url}\`\`\``)
                .join(`\n&&\n`)}`,
            inline: false,
        });
    };

    try
    {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name: `${m.author.username || 'null'} (${m.author.id || 'null'})`,
                iconURL: m.author.avatarURL() ? m.author.avatarURL() : m.author.defaultAvatarURL || getDevelop('iconurl')
            })
            .setTitle('Сообщение:' || 'null')
            .setDescription(description || 'null')
            .setThumbnail(m.guild?.iconURL() || getDevelop('iconurl'))
            .setTimestamp()
            .addFields(fields)
    
        const msgEmbeds = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name: `${m.author.username} (${m.author.id})`,
                iconURL: m.author.avatarURL() ? m.author.avatarURL() : m.author.defaultAvatarURL || getDevelop('iconurl')
            })
            .setTitle(`${guild?.name}`)
            .setDescription(
                `**[Сообщение](${m.url})** было ${reason} от ${m.author} (${m.url})\n
                **На сервере:** ${m.guild}\n**Id сервера: **${m.guildId}\n
                **В канале:** **[${m.channel.name}](${m.channel.url})** (${m.channel.url})`)
            .setThumbnail(m.guild?.iconURL() || getDevelop('iconurl'))
            .setTimestamp()
            .addFields()

            try
            {
                const channel = await m.client.channels.fetch(`${channelId}`)
                channel.send({ embeds: [embed, msgEmbeds] })
            }
            catch (err)
            {
                console.log(err)    
            }
    }
    catch(err)
    {
        console.log(err)
    };



/*     if(m.content.length>=1000)
    {
        msg = m.content.slice(0, 1000);
        msgAdd = m.content.slice(1000, m.content.length);
    }
    else
    {
        msg = m.content.slice(0, m.content.length);
    }
    
    if(m2)
    {
        if(m2.content.length>=1000)
        {
            msg2 = m2.content.slice(0, 1000);
            msg2Add = m2.content.slice(1000, m2.content.length);
        }
        else
        {
            msg2 = m2.content.slice(0, m2.content.length);
        }
    }
      
    const fields =
    [
        {
            name: `${m2 ? "Старое с" : "С"}одержание`,
            value: `\`\`\`${msg ? msg
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
                }\`\`\``,
            inline: false,
        },
    ];
    if (m.attachments.size > 0)
    {
        fields.push({
            name: `${m2 ? "Старые в" : "В"}ложения`,
            value: m.attachments
                .map((att) => `\`\`\`${att.url}\`\`\``)
                .join(`\n&&\n`),
            inline: false,
        });
    }
    
    if (m2)
    {
        fields.push({
            name: "Новое содержание",
            value: `\`\`\`${msg2 ? msg2
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
                }\`\`\``,
            inline: false,
        });
    if (m2.attachments.size > 0)
    {
        fields.push({
            name: "Новые вложения",
            value: `${m2.attachments
                .map((att) => `\`\`\`${att.url}\`\`\``)
                .join(`\n&&\n`)}`,
            inline: false,
        });
    }
      }
      if(msgAdd)
      {
        fields.push({
            name: "Дополнительное содержание",
            value: `\`\`\`${msgAdd ? msgAdd
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
            }\`\`\``,
            inline: false
        })
      }
      if(msg2Add)
      {
        fields.push({
            name: "Дополнительное содержание",
            value: `\`\`\`${msg2Add ? msg2Add
                .replaceAll("```", "<code>")
                .replaceAll("`", "\"")
                :
                "<Пусто>"
            }\`\`\``,
            inline: false
        })
      }
      try
      {
        (m.client.channels.cache.get(guildId)).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({
                        name: `${m.author.username} (${m.author.id})`,
                        iconURL: m.author.avatarURL() ? m.author.avatarURL() : m.author.defaultAvatarURL
                    })
                    .setTitle(`${m.client.guilds.cache.get(logGuildId)?.name}`)
                    .setDescription(
                        `**[Сообщение](${m.url})** было ${reason} от ${m.author} (${m.url})\n
                        **На сервере:** ${m.guild}\n**Id сервера: **${m.guildId}\n
                        **В канале:** **[${m.channel.name}](${m.channel.url})** (${m.channel.url})`
                    )
                    .setThumbnail(m.guild?.iconURL())
                    .setTimestamp()
                    .addFields(fields)
                ]
        });
    }
    catch (err)
    {
        debug([err, true]);
    }; */
};

export
{
    sendMessageLog
};
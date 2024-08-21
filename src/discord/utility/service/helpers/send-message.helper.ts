import { Debug } from "develop/debug.develop";
import { ChannelType, Client as DiscordClient, EmbedBuilder } from "discord.js";

const SendMessage = async (Client: DiscordClient, channelId: string, message: string|EmbedBuilder[]) => {
    const channel = Client.channels.cache.get(channelId);

    if(!channel || !(channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement))
        return { type: 0, text: 'Я не могу отправить сообщение на Ваш канал' };

    await channel.sendTyping();

    try {
        if(Array.isArray(message)) {
            await channel.send({ embeds: message });
            return { type: 1, text: 'embed-сообщение' };
        }
        else {
            await channel.send({ content: message });
            return { type: 1, text: message };
        }
    } catch (err) {
        Debug.Error(err);
        return { type: 0, text: err };
    };
};

export default SendMessage;
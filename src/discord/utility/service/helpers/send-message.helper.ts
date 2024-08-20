import { ChannelType, Client as DiscordClient, EmbedBuilder } from "discord.js";

const SendMessage = async (Client: DiscordClient, channelId: string, message: string|EmbedBuilder[]) => {
    const channel = Client.channels.cache.get(channelId);

    if(!channel || !(channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement))
        return;

    await channel.sendTyping();

    setTimeout(async () => {
        return Array.isArray(message)
            ? await channel.send({ embeds: message })
            : await channel.send({ content: message });
    }, 5000);
};

export default SendMessage;
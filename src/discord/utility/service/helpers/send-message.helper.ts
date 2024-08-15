import { ChannelType, Client as DiscordClient } from "discord.js";

const SendMessage = async (Client: DiscordClient, channelId: string, message: string) => {
    const channel = Client.channels.cache.get(channelId);

    if(!channel || channel.type !== ChannelType.GuildText)
        return;

    await channel.sendTyping();

    setTimeout(async () => {
        await channel.send({ content: message });
    }, 5000);
};

export default SendMessage;
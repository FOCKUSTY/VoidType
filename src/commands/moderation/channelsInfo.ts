import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from 'discord.js';
const userGuildChannelsId: any = [];

module.exports =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('channelsinfo')
	.setDescription('Все каналы'),
    async execute(interaction: CommandInteraction)
    {
        const int = interaction;
        const client = int.client;
        if(int.user.id === `877154902244216852`)
        {
            await interaction.reply({
                content: `Сейчас отправлю!`,
                ephemeral: true });
            client.channels.cache.forEach(channel =>
            {
                let channelId = channel.id;
        
                // `\n### ${channelGuildId} - ${`${channelGuild}`.slice(0,20)}\n- ${channelId} - ${`${channelName}`.slice(0,15)}\n - <@${channelGuildOwner}>`
                userGuildChannelsId.push( `\n## ${channelId}\n### ${channel}` )
            });
            
            for(let i = 0; i < userGuildChannelsId.length; i += 35)
            {
                const embedTwo = new EmbedBuilder()
                    .setColor(0x161618)
                    .setTitle('Информация с серверов')
                    .setAuthor({ name: `The Void}`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png` })
                    .setDescription(`${userGuildChannelsId.slice(0 + i, 35 + i)}`)
                    .setTimestamp()
                await int.followUp({content: ``, embeds: [embedTwo], ephemeral: true})
            }
        }
        else
        {
            await int.reply({
                content: `У Вас нет прав`,
                ephemeral: true
            });
        };
},
};
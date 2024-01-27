import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from 'discord.js';
const clientGuilds: any[] = [];

module.exports =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('serversinfo')
	.setDescription('Все сервера !'),
    async execute(interaction: CommandInteraction)
    {
        
        const int = interaction;
        const client = int.client;
        
        if(int.user.id === `877154902244216852`)
        {

            await interaction.reply({
                content: `Сейчас будет!`,
                ephemeral: true});
            client.guilds.cache.forEach(guild =>
            {
                var clientGuildId = guild.id;
                var clientGuildName = guild;
                var clientGuildOwner = guild.ownerId;
                clientGuilds.push(`\n### Name: ${clientGuildName}\n> **Id:** ${clientGuildId}\n> **Owner:** <@${clientGuildOwner}>`)
            });
            for(let i = 0; i < clientGuilds.length; i += 100)
            {
                const embedTwo = new EmbedBuilder()
                    .setColor(0x161618)
                    .setTitle('Информация о серверах')
                    .setAuthor({ name: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png` })
                    .setDescription(`${clientGuilds.slice(0 + i, 100 + i)}`)
                    .setTimestamp()
                    .setFooter({text: `The Void`, iconURL: `https://cdn.discordapp.com/icons/1169284741846016061/63ff0e27c4c5de492894df065ef72266.png`})

                await int.followUp({content: ``, embeds: [embedTwo], ephemeral: true})
	        };
        }
        else
        {
            await int.reply({
                content: `У Вас нет прав`,
                ephemeral: true
            })
        };
    },
};
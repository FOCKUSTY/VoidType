import { CommandInteraction, SlashCommandBuilder, Client } from "discord.js";

module.exports =
{
    data: new SlashCommandBuilder()
        .setName("sleep")
        .setDescription("Уложить бота спать !"),
    async execute(interaction: CommandInteraction)
    {
        const client: Client = interaction.client

        if(interaction.user.id === `877154902244216852`)
        {
            await interaction.reply({
            content: `Бот завершил работу!`,
            ephemeral: true
        })

            console.log(`Бот сбит...`)
            await client.destroy();
            setTimeout(() => { process.exit() }, 1000)
        }
        else
        {
            console.log(`Error: Недостаточно прав`)
            await interaction.reply({
                content: `У Вас недостаточно прав`,
                ephemeral: true
            })
        };
    }
};
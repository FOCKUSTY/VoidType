import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export =
{
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Вовращает понг !"),
    async execute(interaction: CommandInteraction)
    {

        const sent = await interaction.reply({ content: '# Pong ! :tophat:\n Считаем время...', fetchReply: true, ephemeral: true});

        let awaitSecond: number = Math.round((sent.createdTimestamp - interaction.createdTimestamp) / 1000 * Math.pow(10, 1)) / Math.pow(10, 1);
        
        await interaction.editReply({ content: `# Pong ! :tophat:\n- Задержка бота: \n - ${sent.createdTimestamp - interaction.createdTimestamp}ms\n - ${awaitSecond}s`})

    }
};
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import PseudoRandom from "utility/service/pseudo-random.service";

export = {
	data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Случайный выбор чисел !")
        .addIntegerOption(option =>
            option.setName('min').setDescription('Первое число').setRequired(true))
        .addIntegerOption(option =>
            option.setName('max').setDescription('Второе число').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const min: number = Number(interaction.options.get('min')?.value || 0);
        const max: number = Number(interaction.options.get('max')?.value || 0);

        if(min === max)
            return await interaction.reply({ content: 'Ваши числа одинаковые', ephemeral: true });

        await interaction.reply({ content: `Выбираю между: ${min} & ${max}`, ephemeral: true })

        const number = max > min
            ? PseudoRandom.Number(min, max, [])
            : PseudoRandom.Number(max, min, []);

        setTimeout(async () => {
            await interaction.editReply({ content: `Ваше число ${number}` });
        }, 1000);
    }
};
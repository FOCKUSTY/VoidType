import { CommandInteraction, Client, ApplicationCommandType, InteractionReplyOptions, Interaction, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { Random } from "random-js";
const r = new Random();

export const random: Command = {
    name: "random",
    description: "Случайный выбор чисел !",
    type: ApplicationCommandType.ChatInput,
    options: [
            {
                name: `first`,
                type: ApplicationCommandOptionType.Integer,
                description: `Первое число`,
                required: true
            },
            {
                name: `second`,
                type: ApplicationCommandOptionType.Integer,
                description: `Второе число`,
                required: true
            }
            ],

    run: async (client: Client, interaction: CommandInteraction) => {
        
        const firstInt: number = Number(interaction.options.get('first')?.value)|| 0
        const secondInt: number = Number(interaction.options.get('second')?.value)|| 0

        await interaction.reply({ content: `# :tophat:\n## Выбираю между \`${firstInt}\` и \`${secondInt}\``, fetchReply: true, ephemeral: true});

        let randomNumber: number;

		if(firstInt != secondInt) {

		if(secondInt>firstInt){randomNumber = r.integer(firstInt, secondInt)}
		else if(secondInt<firstInt){randomNumber = r.integer(secondInt, firstInt)}

		setTimeout(() => {
			interaction.editReply(`Ваше число: \`${randomNumber}\``)
		}, 1000)
    } else {
		const secondRandomNumber: number = r.integer(0, 10000)

		function equals() {
			setTimeout(() => {
				interaction.editReply(`# :tophat:\n## Ой, числа одинаковые... Выбираю сам...`);
		}, 1200)
			setTimeout(() => {
				interaction.editReply(`Ваше число: \`${randomNumber}\` ||(Выбрано между ${firstInt} и ${secondRandomNumber})||`);
			}, 2200)
		}

		if(secondRandomNumber>firstInt){
			randomNumber = r.integer(firstInt, secondRandomNumber);
			equals();
		}
		else if(firstInt>secondRandomNumber){
			randomNumber = r.integer(secondRandomNumber, firstInt);
			equals();
		} else {
			interaction.editReply(`# :tophat:\n## И мои числа одинаковые...(`)
		}
	}
}}
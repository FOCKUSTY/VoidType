import { Interaction } from "src/types/telegram/interaction.type";

export = {
    name: 'help',
    async execute(interaction: Interaction) {
        await interaction.reply('Команда не доработана');
    }
};
import { Interaction } from "src/types/telegram/interaction.type";
import Commands from 'telegram/index.commands';

export = {
    name: 'test',
    async execute(interaction: Interaction) {
        await interaction.reply(`Привет, вот мои команды: ${Commands.commands.join('\n')}\nЧтобы узнать больше, можете воспользоваться /help`)
    }
};
import { commands } from 't@deploy-commands'

export =
{
    name: 'help',
    async execute(interaction: any)
    {
        const clientCommands = [];

        for(let command of commands)
        {
            if(!command[1][1]) clientCommands.push(`🎩${command[0]}`);

            else
            {
                const options = [];

                for(let option of command[1][1]) options.push(`     -🎩${option}`);

                clientCommands.push(`🎩${command[0]}\n- Опции:\n${options.join(`\n`)}`);
            };
        };

        await interaction.reply(`Мои доступные команды:\n${clientCommands.join('\n')}`)
    }
};
import { SlashCommandBuilder } from 'discord.js';
import { updateActivities } from '../../utils/updateActivities';

export =
{
    cooldown: 5,
    data: new SlashCommandBuilder()
	.setName('update-act')
	.setDescription('Обновить активности!')
    .setNameLocalizations({ru:'обновить-активности',"en-US":'update-act'})
    .setDescriptionLocalizations({ru:'Обновить активности !',"en-US":'Update activities !'}),
    async execute(interaction: any)
    {
        updateActivities(interaction.client);
        
        return await interaction.reply( { content: `Активности были успешно обновлены !`, ephemeral: true } );
    },
};
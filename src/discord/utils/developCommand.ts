import { CommandInteraction } from "discord.js";

const developCommand = async (interaction: CommandInteraction) =>
{
    return await interaction.reply( { content:'Эта команда пока что находится в разработке', ephemeral: true } );
};

export
{
    developCommand
};
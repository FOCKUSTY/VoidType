import { Debug } from "develop/debug.develop";
import { Interaction, InteractionType } from "discord.js";
import customIds from "utility/modal/custom-ids.modal";

export = {
	name: 'modal-listener',
	async ModalListener(interaction: Interaction) {
        if(interaction.type !== InteractionType.ModalSubmit)
            return;

        for(const id in customIds)
        {
            if(interaction.customId != customIds[id].id)
                continue;

            await customIds[id].execute(interaction);
        };
    }
};
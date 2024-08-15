import { Interaction, InteractionType } from "discord.js";
import customIds from "utility/modal/custom-ids.modal";

const ids: any = customIds;

export = {
	name: 'modal-listener',
	async ModalListener(interaction: Interaction) {
        if(interaction.type !== InteractionType.ModalSubmit)
            return;

        for(const id in ids)
        {
            if(interaction.customId != ids[id].id)
                continue;

            await ids[id].execute(interaction);
        };
    }
};
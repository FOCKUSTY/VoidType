import { Debug } from "develop/debug.develop";
import {
	Interaction,
	InteractionResponse,
	InteractionType,
	ModalSubmitInteraction
} from "discord.js";
import customIds from "utility/modal/custom-ids.modal";

const ids: {
	[key: string]: {
		id: string;
		components: { [key: string]: string };
		execute: (
			interaction: ModalSubmitInteraction
		) => Promise<void | InteractionResponse<boolean>>;
	};
} = customIds;

export = {
	name: "modal-listener",
	async ModalListener(interaction: Interaction) {
		if (interaction.type !== InteractionType.ModalSubmit) return;

		for (const id in ids) {
			if (interaction.customId != ids[id].id) continue;

			try {
				Debug.Log(["Запуск модальника: " + ids[id], "под id: " + ids[id].id]);

				await ids[id].execute(interaction);
			} catch (error) {
				Debug.Error(error);

				await interaction.reply({
					content: "Произошла какая-то ошибка",
					ephemeral: true
				});
			}
		}
	}
};

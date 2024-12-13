import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ActivitiesLoader } from "@thevoid";

export = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("update-activity")
		.setDescription("Принудительное обновление активностей !")
		.setNameLocalizations({ ru: "обновить-активности", "en-US": "update-activity" })
		.setDescriptionLocalizations({
			ru: "Принудительное обновление активностей",
			"en-US": "Forced update of activities"
		}),
	async execute(interaction: CommandInteraction) {
		try {
			new ActivitiesLoader().reload();

			return await interaction.reply({
				content: "Активности были успешно обновлены",
				ephemeral: true
			});
		} catch (err) {
			return await interaction.reply({
				content: "Произошла какая-то ошибка",
				ephemeral: true
			});
		}
	}
};

import type { Interaction } from "discord.js";
import { Collection } from "discord.js";

import { config } from "src/index.config";

export = {
	name: "interaction-create",
	async InteractionCreate(
		interaction: Interaction,
		commands: Collection<any, any>,
		cooldowns: Collection<any, any>
	) {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (!cooldowns.has(command.data.name))
			cooldowns.set(command.data.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (
			timestamps.has(interaction.user.id) &&
			interaction.user.id !== config.authorId
		) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					ephemeral: true
				});
			}
		}

		if (interaction.user.id !== config.authorId) {
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);

			if (interaction.replied || interaction.deferred)
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true
				});
			else
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true
				});
		}
	}
};

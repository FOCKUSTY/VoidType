import type { Interaction } from "types/telegram/interaction.type";
import type { Response } from "types/telegram/response.type";
import type { Option } from "types/telegram/options.type";

import { options } from "telegram/events/message.listener";

import { ollama } from "@thevoid/ollama";

export = {
    name: "ai",
    options: ["promt"],
    async execute(interaction: Interaction) {
		const replyOptions: Option[] = [{
				command: "ai",
				option: "promt",
				error: "",
				text: "Введите Ваш запрос:",

				id: interaction.message.message_id
			},
			{
				command: "ai",
				option: "end",
				error: "Произошли проблемы...\nОшибка:\n%ERROR%",
				text: "%SUCCESS%\nОтвет:\n%MESSAGE%",
				function: async (promt: string): Promise<Response> => {
					const data = ollama.chat({
						model: "llama3.2",
						messages: [{
							role: "user",
							content: promt
						}],
						options: {
							num_gpu: 2
						}
					});

					return {
						data,
						text: "Спасибо, что пользуетесь The Void\nМодель: llama3.2\n",
						type: 1,
						dataContent: {
							text: ".message.content"
						}
					};
				},

				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(replyOptions[0].text);
    }
};

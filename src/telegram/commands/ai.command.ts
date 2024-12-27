import type { Interaction } from "types/telegram/interaction.type";
import type { Response } from "src/types/all/response.type";
import type { ExecuteData, Option } from "types/telegram/options.type";

import { options } from "telegram/events/message.listener";

import { ModelVersion } from "@thevoid/ollama/types/ollama.types";
import { ChatResponse } from "@thevoid/ollama";
import Llama from "ai/llama.ai";

export = {
	name: "ai",
	options: ["promt"],
	async execute(interaction: Interaction) {
		const command = interaction.message.text.split(" ");
		const models = ["TheVoid", "llama3.2", "llama3.3"];
		const model = models.includes(command[1]) ? (command[1] as ModelVersion) : "TheVoid";

		const replyOptions: Option[] = [
			{
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
				function: async (promt: string): Promise<Response<ChatResponse>> => {
					return new Llama().chat(promt, "Спасибо, что пользуетесь The Void", model);
				},
				execute: (data: ExecuteData) => {
					data.message.reply("Запрос принят! Ждите ответа!");

					data.response.data.then((d: ChatResponse) => {
						data.send({
							...data,
							response: {
								...data.response,
								data: { text: d.message.content }
							}
						});
					});
				},

				id: 0
			}
		];

		options.set(interaction.from?.id!, replyOptions);

		await interaction.reply(replyOptions[0].text);
	}
};

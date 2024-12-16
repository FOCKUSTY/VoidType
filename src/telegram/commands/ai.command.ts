import type { Interaction } from "types/telegram/interaction.type";
import type { Response } from "src/types/all/response.type";
import type { ExecuteData, Option } from "types/telegram/options.type";

import { options } from "telegram/events/message.listener";

import { ChatResponse } from "@thevoid/ollama";
import Llama from "ai/llama.ai";

export = {
	name: "ai",
	options: ["promt"],
	async execute(interaction: Interaction) {
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
				function: async (promt: string): Promise<Response> => {
					return new Llama().chat(
						promt,
						"Спасибо, что пользуетесь The Void, модель: llama3.2\n"
					);
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

import type { Interaction } from "types/telegram/interaction.type";
import type { Response } from "src/types/all/response.type";
import type { ExecuteData, Option } from "types/telegram/options.type";

import { options } from "telegram/events/message.listener";

import { ModelVersion } from "@thevoid/ollama/types/ollama.types";
import { ChatResponse, OllamaResponse } from "@thevoid/ollama";
import Llama from "ai/llama.ai";

type FunctionDataType = Response<OllamaResponse<Promise<ChatResponse>> | "Error">

type DefaultOption = Option<
	FunctionDataType,
	string[], string[],
	{ text: string }
>;

type DefaultExectuteData = ExecuteData<
	DefaultOption,
	FunctionDataType,
	{ text: string }
>;

export = {
	name: "ai",
	options: ["promt"],
	async execute(interaction: Interaction) {
		const command = interaction.message.text.split(" ");
		const models = ["TheVoid", "llama3.2", "llama3.3"];
		const model = models.includes(command[1])
			? (command[1] as ModelVersion)
			: "TheVoid";

		if (!interaction.from)
			return;

		const replyOptions: DefaultOption[] = [
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
				function: async (promt: string): Promise<FunctionDataType> => {
					const data = new Llama().chat(
						promt,
						"Спасибо, что пользуетесь The Void",
						model
					);

					if (data.type === 0)
						return { data: "Error", text: "Error", type: 0 };

					return {
						data: data.data,
						text: "Ok",
						type: 1
					};
				},
				execute: (data: DefaultExectuteData) => {
					if (typeof data.response.data.data === "string")
						return;

					if (data.response.type === 0 || !data.response.data.data.ollama)
						return;

					data.message.reply("Запрос принят! Ждите ответа!");

					data.response.data.data.ollama.then((d: ChatResponse) => {
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

		options.set(`${interaction.from.id}`, replyOptions);

		await interaction.reply(replyOptions[0].text);
	}
};

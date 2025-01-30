import type { Interaction } from "@voidy/types/dist/telegram/interaction.type";
import type { Response } from "@voidy/types/dist/all/response.type";
import type { ExecuteData, Option } from "@voidy/types/dist/telegram/options.type";

import { options } from "../events/message.listener";

import { ModelVersion } from "@thevoidcommunity/the-void-database/ollama/types/ollama.types";
import { ChatResponse, OllamaResponse } from "@thevoidcommunity/the-void-database/ollama";

import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";

type FunctionDataType = OllamaResponse<Promise<ChatResponse>> | "Error";
type DefaultOption = Option<FunctionDataType, string[], string[], { text: string }>;
type DefaultExectuteData = ExecuteData<DefaultOption, FunctionDataType, { text: string }>;

export default class Command extends TelegramCommand {
	public constructor(services: { llama: any }) {
		super({
			name: "ai",
			options: ["promt"],
			async execute(interaction: Interaction) {
				const command = interaction.message.text.split(" ");
				const models = ["TheVoid", "llama3.2", "llama3.3"];
				const model = models.includes(command[1])
					? (command[1] as ModelVersion)
					: "TheVoid";
		
				if (!interaction.from) return;
		
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
						function: async (promt: string): Promise<Response<FunctionDataType>> => {
							const data = services.llama.chat(
								promt,
								"Спасибо, что пользуетесь The Void",
								model
							);
		
							if (data.type === 0) return { data: "Error", text: "Error", type: 0 };
		
							return {
								data: data.data,
								text: "Ok",
								type: 1
							};
						},
						execute: (data: DefaultExectuteData) => {
							if (typeof data.response.data === "string") return;
		
							if (data.response.type === 0 || !data.response.data.ollama)
								return;
		
							data.message.reply("Запрос принят! Ждите ответа!");
		
							data.response.data.ollama.then((d: ChatResponse) => {
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
		});
	}
};
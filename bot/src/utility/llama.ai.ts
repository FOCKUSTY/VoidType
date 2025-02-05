import { ModelVersion } from "@thevoidcommunity/the-void-database/ollama/types/ollama.types";

import Ollama, {
	OllamaResponse,
	ChatResponse
} from "@thevoidcommunity/the-void-database/ollama";
import type { Response } from "@voidy/types/dist/all/response.type";

import { Debug } from "@voidy/develop/dist";
import { Colors } from "f-formatter";

const promts = new Map<string, string>();

class Llama {
	public constructor() {}

	public chat(
		promt: string,
		text: string = "",
		model: ModelVersion = "TheVoid"
	): Response<OllamaResponse<Promise<ChatResponse>>> {
		try {
			const id = new Date().getTime().toString(16);
			promts.set(promt, id);

			Debug.Log([
				"Ввод запроса: " + Colors.bgCyan + id + Colors.magenta + ":",
				promt,
				"Модель: " + model
			]);

			const data = new Ollama({ model }).chat({
				model: model,
				stream: false,
				messages: [{ role: "user", content: promt }]
			});

			if (!data.ollama) {
				Debug.Error(new Error("Произошла ошибка с ответом."));

				return {
					data: data,
					text: "Произошла ошибка.",
					type: 0
				};
			}

			data.ollama.then((r) =>
				Debug.Log(["Ответ на запрос: " + id + ":", r.message.content])
			);

			return {
				data: data,
				text: `${text}\nМодель: ${model}\nВаш id: ${id}\n`,
				type: 1,
				dataContent: {
					text: ".message.content"
				}
			};
		} catch (error) {
			Debug.Error(error);

			return {
				data: {
					model: "TheVoid",
					text: `${error}`,
					type: 0
				},
				text: "Произошла ошибка",
				type: 0
			};
		}
	}
}

export default Llama;

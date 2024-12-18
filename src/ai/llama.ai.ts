import { ModelVersion } from "@thevoid/ollama/types/ollama.types";
import Ollama from "@thevoid/ollama";

import type { Response } from "types/all/response.type";

import { Debug } from "develop/debug.develop";
import { Colors } from "f-formatter";

const ollama = new Ollama();
const promts = new Map<string, string>();

class Llama {
	public constructor() {}

	public chat(
		promt: string,
		text: string = "",
		model: ModelVersion = "TheVoid"
	): Response {
		try {
			const id = new Date().getTime().toString(16);
			promts.set(promt, id);

			Debug.Log([
				"Ввод запроса: " + Colors.bgCyan + id + Colors.magenta + ":",
				promt,
				"Модель: " + model
			]);

			const data = ollama.chat({
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
				data: data.ollama,
				text: `${text}\nМодель: ${model}\nВаш id: ${id}\n`,
				type: 1,
				dataContent: {
					text: ".message.content"
				}
			};
		} catch (error) {
			Debug.Error(error);

			return {
				data: error,
				text: "Произошла ошибка",
				type: 0
			};
		}
	}
}

export default Llama;

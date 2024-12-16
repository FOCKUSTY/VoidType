import Ollama from "@thevoid/ollama";

import type { Response } from "types/all/response.type";

import { Debug } from "develop/debug.develop";
import { Colors } from "f-formatter";

const ollama = new Ollama();
const promts = new Map<string, string>();

class Llama {
	public constructor() {}

	public chat(promt: string, text: string = "Модель: llama3.2"): Response {
		try {
			const id = new Date().getTime().toString(16);
			promts.set(promt, id);

			Debug.Log([
				"Ввод запроса: " + Colors.bgCyan + id + Colors.magenta + ":",
				promt
			]);

			const data = ollama.chat(promt);

			data.then((r) =>
				Debug.Log(["Ответ на запрос: " + id + ":\n", r.message.content])
			);

			return {
				data: data,
				text: text + "Ваш уникальный id: " + id + "\n",
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

import Ollama from "@thevoid/ollama";

import type { Response } from "types/all/response.type";

import { Debug } from "develop/debug.develop";

const ollama = new Ollama();

class Llama {
    public constructor() {};

    public chat(promt: string, text: string = "Модель: llama3.2"): Response {
        try {
            const data = ollama.chat(promt);

            return {
                data: data,
                text: text,
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
        };
    };
};

export default Llama;
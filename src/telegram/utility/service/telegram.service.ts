import { Interaction } from "src/types/telegram/interaction.type";
import { Telegraf } from "telegraf";
import { Debug } from "src/develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";
import GetChatId from "./helpers/get-chat-id.helper";

import Client from "src/telegram.bot";
import { Response } from "types/telegram/response.type";

class Telegram {
	private _client: Telegraf = Client;

	public SendAnonMessage = async (
		chatId: number | string,
		message: string | string[],
		userId: number | string
	): Promise<Response> => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		if (chatId == userId)
			return {
				data: { type: 1 },
				text: "Вы не можете отправить сообщение самому себе",
				type: 0
			};

		let text: string =
			"Спасибо, что пользуетесь The Void, вам прислали анонимное сообщение!\r\n\r\n";

		if (Array.isArray(message)) for (const msg of message) text += `\n${msg}`;
		else text = message;

		try {
			return {
				data: await Client.telegram.sendMessage(chatId, text),
				text: "Сообщение успешно отправлено",
				type: 1
			};
		} catch (error) {
			return {
				data: error,
				text: "Сообщение не было доставлено",
				type: 0
			};
		}
	};

	public SendMessage = async (
		chatId: number | string,
		message: string | string[]
	): Promise<Response> => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		return {
			data: await SendMessage(this._client, chatId, message),
			text: "Сообщение успешно отправлено",
			type: 1
		};
	};

	public GetChatId = (message: Interaction): Response => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		return {
			data: GetChatId(this._client, message),
			text: "id успешно взят",
			type: 1
		};
	};

	get client(): Telegraf {
		return this._client;
	}
}

export default Telegram;

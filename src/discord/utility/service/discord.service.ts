import { Client as DiscordClient, EmbedBuilder } from "discord.js";
import { Debug } from "develop/debug.develop";

import SendMessage from "./helpers/send-message.helper";
import Client from "src/discord.bot";
import { Response } from "src/types/all/response.type";

class Discord {
	private readonly _client: DiscordClient = Client;

	public readonly SendMessage = async (
		channelId: string,
		message: string | EmbedBuilder[]
	) => {
		if (!this._client) return Debug.Error("Client is not defined");

		return await SendMessage(this._client, channelId, message);
	};

	public readonly SendMessageToTelegram = async (
		channelId: string,
		message: string,
		telegramName: string
	): Promise<Response> => {
		if (!this._client)
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};

		try {
			return {
				data: await SendMessage(
					this._client,
					channelId,
					`Отправлено из Telegram от ${telegramName} \n${message}`
				),
				text: "Сообщение успешно отправлено",
				type: 1
			};
		} catch (error) {
			Debug.Error(error);

			return {
				data: error,
				text: "Сообщение не было отправлено",
				type: 0
			};
		}
	};

	get client(): DiscordClient {
		return this._client;
	}
}

export default Discord;

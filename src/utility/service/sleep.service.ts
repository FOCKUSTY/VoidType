import { Debug } from "develop/debug.develop";
import type { Client as DiscordClient } from "discord.js";

class Sleep {
	public static execute = async (Client: DiscordClient) => {
		Debug.Log(["Выключения бота..."]);

		await Client.destroy();
		setTimeout(() => {
			process.exit();
		}, 1000);
	};
}

export default Sleep;

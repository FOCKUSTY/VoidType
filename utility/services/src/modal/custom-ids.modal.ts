import DiscordModal from "./abstract.modal";

import SayTelegramMessage from "./say-telegram-message.modal";
import SayMessage from "./say-message.modal";
import Update from "./update.modal";
import IdeaModal from "./idea.modal";

class CustomIds {
	private readonly _discord_service: any;
	private readonly _telegram_service: any;

	public constructor(telegramService: any, discordService: any) {
		this._telegram_service = telegramService;
		this._discord_service = discordService;
	}

	public static getIds() {
		const ids: {[key: string]: {
			id: string,
			components: { [key: string]: string }
		}} = {};

		for (const key in this.ids) {
			const modal = this.ids[key];

			ids[key] = {
				id: modal.prototype.id,
				components: modal.prototype.components
			};
		};

		return ids;
	}

	static get ids() {
		return {
			sayModal: SayMessage,
			sayTelegramModal: SayTelegramMessage,
			updateModal: Update,
			ideaModal: IdeaModal
		};
	}

	get ids(): {[key: string]: DiscordModal} {
		return {
			sayModal: new SayMessage(),
			sayTelegramModal: new SayTelegramMessage(this._telegram_service),
			updateModal: new Update(this._telegram_service, this._discord_service),
			ideaModal: new IdeaModal()
		};
	}
}

export default CustomIds;

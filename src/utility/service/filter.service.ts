import type { Guild, User } from "discord.js";

import { utility } from "@thevoid/loaders/data/activities.loader";

class Filter {
	private _banwords: any[] = [];
	private _last_value: string | null = null;

	constructor(banwords?: any[] | undefined) {
		this._banwords = banwords ? banwords : utility.banwords;
	}

	private readonly BadwordsHandler = (value: string): string | null => {
		for (const banword of this._banwords) {
			const word = new RegExp(banword.replaceAll("*", "[@!#$%&*-+=]+"));

			if (value.match(word)) return null;
			else continue;
		}

		return value;
	};

	public readonly execute = (value: string): string | null => {
		if (this._banwords.length === 0) this._banwords = utility.banwords;

		if (this._banwords.includes(value)) {
			this._last_value = null;
		} else {
			this._last_value = this.BadwordsHandler(value);
		}

		return this._last_value;
	};

	public readonly guildFilter = (guild: Guild): string | null => {
		const verifiedGuild = this.execute(guild.name);

		this._last_value = verifiedGuild;

		return this._last_value || verifiedGuild;
	};

	public readonly userFilter = (user: User): string | null => {
		if (user.bot) {
			this._last_value = null;
		} else {
			const verifiedUser = this.execute(user.globalName || user.username);

			this._last_value = verifiedUser;
		}

		return this._last_value;
	};

	get lastValue() {
		return this._last_value;
	}
}

export default Filter;

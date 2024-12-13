import { Client as DiscordClient } from "discord.js";

import { objects } from "@thevoid/loaders/data/objects.loader";
import Filter from "utility/service/filter.service";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

const filter = new Filter();

const guilds: string[] = [];
const users: string[] = [];
const names: string[] = [];

const formatter = new Formatter();

class ClientLoaderClass {
	private readonly Logger = new Logger("Loader").execute;

	private _guilds: string[] = [];
	private _users: string[] = [];
	private _names: string[] = [];

	constructor() {
		this._guilds = guilds;
		this._users = users;
		this._names = names;
	}

	private readonly UsersLoader = async (Client: DiscordClient) => {
		const size = Client.users.cache.filter((u) => !u.bot).size;

		this.Logger(
			`Загрузка ${size} ` +
				formatter.RuWords(size, ["пользователя", "пользователей"]),
			Colors.yellow
		);

		Client.users.cache.forEach((user) => {
			const name = filter.userFilter(user);

			if (name) users.push(name);
		});

		if (size - users.length > 0)
			this.Logger(
				`Отсеивание ${size - users.length} ${formatter.RuWords(size - users.length, ["пользователя", "пользователей"])}`,
				Colors.yellow
			);

		this.Logger(
			`Загрузка ${users.length} ${formatter.RuWords(users.length, ["пользователя", "пользователей"])} успешна`,
			Colors.green
		);
	};

	private readonly GuildsLoader = async (Client: DiscordClient) => {
		const size = Client.guilds.cache.size;

		this.Logger(
			`Загрузка ${size} ` + formatter.RuWords(size, ["гильдии", "гильдий"]),
			Colors.yellow
		);

		Client.guilds.cache.forEach((guild) => {
			const name = filter.guildFilter(guild);

			if (name) guilds.push(name);
		});

		if (size - guilds.length > 0)
			this.Logger(
				`Отсеивание ${size - guilds.length} ${formatter.RuWords(size - guilds.length, ["гильдии", "гильдий"])}`,
				Colors.yellow
			);

		this.Logger(
			`Загрузка ${guilds.length} ${formatter.RuWords(guilds.length, ["гильдии", "гильдий"])} успешна`,
			Colors.green
		);
	};

	public readonly execute = async (Client: DiscordClient) => {
		this.UsersLoader(Client);
		this.GuildsLoader(Client);

		names.push(...objects.names);
	};

	public get guilds() {
		return this._guilds;
	}

	public get users() {
		return this._users;
	}

	public get names() {
		return this._names;
	}

	public Get = (getter: "user" | "guild" | "name"): string[] => {
		if (getter === "user") return this._users;
		else if (getter === "guild") return this._guilds;
		else return this._names;
	};
}

export default ClientLoaderClass;

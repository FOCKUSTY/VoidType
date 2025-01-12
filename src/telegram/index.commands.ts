type FullCommand<T, K> = {
	name: string;
	options: string[];
	executeFunc?: (...args: T[]) => K;
};

class Commands<T, K> {
	private readonly _commands: string[] = [];
	private readonly _full_commands: FullCommand<T, K>[] = [];

	public setCommand(command: FullCommand<T, K>) {
		this._full_commands.push(command);
	}

	public set commands(name: string) {
		this._commands.push(name);
	}

	public get fullCommands(): FullCommand<T, K>[] {
		return this._full_commands;
	}

	public get commands(): string[] {
		return this._commands;
	}
}

export default new Commands();

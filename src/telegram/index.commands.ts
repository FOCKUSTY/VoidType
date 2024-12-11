type FullCommand = {
	name: string,
	options: string[],
	executeFunc?: (...args: any) => any
}

class Commands {
	private readonly _commands: string[] = [];
	private readonly _full_commands: FullCommand[] = [];

	public setCommand(command: FullCommand) {
		this._full_commands.push(command);
	}

	public set commands(name: string) {
		this._commands.push(name);
	}

	public get fullCommands(): FullCommand[] {
		return this._full_commands;
	}

	public get commands(): string[] {
		return this._commands;
	}
}

export default new Commands();

class Commands {
	private _commands: string[] = [];

	public set commands(name: string) {
		this._commands.push(name);
	}

	public get commands(): string[] {
		return this._commands;
	}
}

export default new Commands();

class Commands {
    private _commands: string[] = [];

    set commands (name: string) {
        this._commands.push(name);
    };

    get commands (): string[] {
        return this._commands;
    };
};

export default new Commands();
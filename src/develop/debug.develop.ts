import { settings } from "src/index.config";
import Logger, { Colors } from "fock-logger";

const warn = "------------- !Внимание! --------------";

class Debug {
	private static readonly _log: Logger<"Debugger"> = new Logger("Debugger", {
		colors: [ Colors.cyan, Colors.magenta ],
		write: false,
		prefix: "debug",
		level: "info",
		dir: "./"
	});
	
	private static readonly _error: Logger<"Errorer"> = new Logger("Errorer", {
		colors: [ Colors.red, Colors.red ],
		write: false,
		prefix: "error",
		level: "err",
		dir: "./"
	});
	
	private static readonly _warn: Logger<"Warner"> = new Logger("Warner", {
		colors: [ Colors.yellow, Colors.magenta ],
		write: false,
		prefix: "warn",
		level: "warn",
		dir: "./"
	});

	public static readonly Console = console;

	private static readonly WarnComponent = (msg: Error, type: "error" | "warn") => {
		this._warn.execute(warn);

		const logger: "_error" | "_warn" = ("_" + type) as any;
		const text = "\n" + warn + msg.stack || msg.message + "\n" + warn;

		this[logger].execute(text);
		this[logger].write(text);

		this._warn.execute(warn);
	};

	public static readonly Log = (
		message: any[],
		enabled?: boolean,
		trace?: boolean
	): void => {
		if ((enabled || settings.developMode) && !trace)
			this._log.execute(message)

		if (trace) {
			const text = message.map(msg => JSON.stringify(msg, undefined, 4)).join("\n");
			const error = new Error(text);

			this._log.execute(error.stack || error.message);
			this._log.write(error.stack || error.message);
		};
	};

	public static readonly Trace = () => {
		console.trace();
	};

	public static readonly Error = (error?: any) => {
		if (!error) return;

		this.WarnComponent(error, "error");
	};

	public static readonly Warn = (msg?: any) => {
		if (!msg) return;

		this.WarnComponent(msg, "warn");
	};
}

export { Debug };

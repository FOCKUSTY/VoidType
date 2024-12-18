import { settings } from "src/index.config";
import Logger, { Colors } from "fock-logger";
import { error } from "console";

const warn = "------------- !Внимание! --------------";

class Debug {
	private static readonly _log: Logger<"Debugger"> = new Logger("Debugger", {
		write: true,
		prefix: "debug",
		level: "info",
		dir: "./"
	});

	private static readonly _error: Logger<"Errorer"> = new Logger("Errorer", {
		write: true,
		prefix: "error",
		level: "err",
		dir: "./"
	});

	private static readonly _warn: Logger<"Warner"> = new Logger("Warner", {
		write: true,
		prefix: "warn",
		level: "warn",
		dir: "./"
	});

	public static readonly Console = console;

	private static readonly WarnComponent = (msg: any, type: "error" | "warn") => {
		const error = Array.isArray(msg)
			? msg.join(" ")
			: msg;

		const text = "\n" + warn + "\n" + (error?.stack || error?.message || error) + "\n" + warn;

		if (type === "error") {
			this._error.execute(text);
		} else {
			this._warn.execute(text);
		};
	};

	public static readonly Log = (
		message: any[],
		enabled?: boolean,
		trace?: boolean
	): void => {
		if ((enabled || settings.developMode) && !trace) this._log.execute(message);

		if (trace) {
			const text = message
				.map((msg) => JSON.stringify(msg, undefined, 4))
				.join("\n");
			const error = new Error(text);

			this._log.execute(error.stack || error.message);
			this._log.write(error.stack || error.message);
		}
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

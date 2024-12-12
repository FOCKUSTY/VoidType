import { settings } from "src/index.config";

import Formatter, { Colors } from "f-formatter";
import LogFile from "fock-logger/file.logger";

const formatter = new Formatter();
const warn = "------------- !Внимание! --------------";

class Debug {
	private static readonly _log: LogFile = new LogFile("./", undefined, "debug");
	private static readonly _error: LogFile = new LogFile("./", undefined, "error");
	private static readonly _warn: LogFile = new LogFile("./", undefined, "warn");

	public static readonly Console = console;

	private static readonly WarnComponent = (msg: any, type: "error" | "warning") => {
		console.warn(formatter.Color(warn, Colors.yellow));

		const text = "\n" + warn
			+ msg.stack ? msg.stack : msg
			+ "\n" + warn;

		if (type === "error") {
			console.error(formatter.Color(warn, Colors.red));
			this._error.writeFile(text);
		} else {
			console.warn(formatter.Color(warn, Colors.yellow));
			this._warn.writeFile(text);
		}

		console.warn(formatter.Color(warn, Colors.yellow));
	};

	public static readonly Log = (
		message: any[],
		enabled?: boolean,
		trace?: boolean
	): void => {
		if ((enabled || settings.developMode) && !trace) {
			console.log(
				Colors.cyan + "Debugger" + Colors.reset + ":" + Colors.magenta,
				...message,
				Colors.reset
			);
		}

		if (trace) {
			console.trace(
				Colors.cyan + "Debugger" + Colors.reset + ":" + Colors.magenta,
				...message,
				Colors.reset
			);
		}

		for (const msg of message) {
			this._log.writeFile(msg);
		}
	};

	public static readonly Trace = () => {
		console.trace();
	};

	public static readonly Error = (msg?: any) => {
		if (!msg) return;

		this.WarnComponent(msg, "error");
		console.trace();
	};

	public static readonly Warn = (msg?: any) => {
		if (!msg) return;

		this.WarnComponent(msg, "warning");
	};
}

export {
	Debug
};
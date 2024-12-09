import { Colors } from "f-formatter";

const loggers: {
	[key: string]: { name: string; colors: [Colors, Colors] };
} = {
	TheVoid: { name: "The Void", colors: [Colors.red, Colors.magenta] },
	Commands: { name: "Commands", colors: [Colors.brightYellow, Colors.green] },
	Updater: { name: "Updater", colors: [Colors.brightYellow, Colors.yellow] },
	Activity: { name: "Activity", colors: [Colors.brightRed, Colors.green] },
	Events: { name: "Events", colors: [Colors.brightYellow, Colors.green] },
	Loader: { name: "Loader", colors: [Colors.brightYellow, Colors.red] },
	Fail: { name: "Fail", colors: [Colors.red, Colors.red] }
};

export default loggers;

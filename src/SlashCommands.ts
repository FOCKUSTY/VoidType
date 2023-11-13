import { Command } from "./Command";
import { ping } from "./commands/ping";
import { help } from "./commands/help";

export const Commands: Command[] = [
    ping, help
];
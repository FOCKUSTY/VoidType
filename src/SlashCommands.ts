import { Command } from "./Command";
import { ping } from "./commands/ping";
import { help } from "./commands/help";
import { test } from "./commands/test";
import { random } from "./commands/random";
import { kill } from "./commands/kill";
import { user } from "./commands/user";
import { thevoid } from "./commands/infothevoid";

export const Commands: Command[] = [
    ping,
    help,
    test,
    random,
    kill,
    user,
    thevoid,
];
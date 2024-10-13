import { Debug } from 'develop/debug.develop';
import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

import { THEVOIDs_CONSTANTS } from "src/index.constants";
import Constants from 'loaders/utils/constants.service';

import Formatter from 'f-formatter';
import { Colors } from 'f-formatter/colors';

import loggers from './loggers.names';
import Logger from 'fock-logger';

import Server, { Config } from 'fock-server';

Debug.Console.clear();
Debug.Log([new Formatter().Color('Начало программы', Colors.magenta)]);

const bot = process.env.BOT || 'discord';

new Constants(THEVOIDs_CONSTANTS).execute();

for(const name in loggers) {
    const logger = loggers[name];

    new Logger(name, logger.colors).execute(`Hello, I'm ${name}!`);
};

(async () => {
    switch (bot) {
        case 'discord':
            LoginDiscord();
            break;
            
        case 'telegram':
            LoginTelegram();
            break;
            
        default:
            new Server(3002, new Config().authToken).listen();

            LoginDiscord();
            LoginTelegram();
            break;
    };
})();
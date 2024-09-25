import { Debug } from 'develop/debug.develop';
import { LoginDiscord } from './discord.bot';
import { LoginTelegram } from './telegram.bot';

import { THEVOIDs_CONSTANTS } from "src/index.constants";
import Constants from 'loaders/utils/constants.service';
import Formatter, { Colors } from 'utility/service/formatter.service';

Debug.Console.clear();
Debug.Log([Formatter.Color('Начало программы', Colors.magenta)]);

const bot = process.env.BOT || 'discord';

new Constants(THEVOIDs_CONSTANTS).execute();

(async () => {
    switch (bot) {
        case 'discord':
            LoginDiscord();
            break;
            
        case 'telegram':
            LoginTelegram();
            break;
            
        default:
            LoginDiscord();
            LoginTelegram();
            break;
    };
})();
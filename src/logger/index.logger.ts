import Formatter, { Colors } from "utility/service/formatter.service";
import LoggersNames from './logger-names';

class Logger {
    private _name: string;
    private _colors: [Colors, Colors];
    
    constructor(name: string, colors: [Colors, Colors]) {
        this._name = name;
        this._colors = colors;
    };

    public execute = (text: string, color?: Colors) => {
        console.log(
            Formatter.Color(this._name, this._colors[0]) + ':',

            Formatter.Color(text, color
                ? color
                : this._colors[1]
            )
        );
    };
};

const loggers: { [ key: string ]: Logger } = {};

for(const key in LoggersNames) {
    const logger = LoggersNames[key];
    
    loggers[key] = new Logger(logger.name, logger.colors);
};

export default loggers;
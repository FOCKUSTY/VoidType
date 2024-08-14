import Formatter, { Colors } from "utility/service/formatter.service";

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

const loggers = {
    TheVoid:  new Logger('The Void', [ Colors.red,          Colors.magenta ]),
    Updater:  new Logger('Updater',  [ Colors.brightYellow, Colors.yellow  ]),
    Activity: new Logger('Activity', [ Colors.brightRed,    Colors.green   ]),
    Events:   new Logger('Events',   [ Colors.brightYellow, Colors.green   ]),
    Commands: new Logger('Commands', [ Colors.brightYellow, Colors.green   ]),
    Loader:   new Logger('Loader',   [ Colors.brightYellow, Colors.red     ]),
    Fail:     new Logger('Fail',     [ Colors.red,          Colors.red     ])
};

export default loggers;
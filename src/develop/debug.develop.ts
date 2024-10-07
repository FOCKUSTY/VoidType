import { settings } from "config";

import { Colors } from "f-formatter/colors";
import LogFile from "fock-logger/file.logger";

export class Debug {
    private static readonly _log: LogFile = new LogFile('./', undefined, 'debug');
    private static readonly _error: LogFile = new LogFile('./', undefined, 'error');
    private static readonly _warn: LogFile = new LogFile('./', undefined, 'warn');

    public static readonly Console = console;

    private static readonly WarnComponent = (msg: string, type: 'error'|'warning') => {
        console.warn(Colors.yellow + '------------- !Внимание! --------------' + Colors.reset);

        const text = `
        '------------- !Внимание! --------------'
        ${msg}
        '------------- !Внимание! --------------'
        `

        if(type === 'error') {
            console.error(Colors.red + msg + Colors.reset);
            this._error.writeFile(text);
        }
        else {
            console.warn(Colors.yellow + msg + Colors.reset);
            this._warn.writeFile(text);
        };

        console.warn(Colors.yellow + '------------- !Внимание! --------------' + Colors.reset);
    };

    public static readonly Log = (message: any[], enabled?: boolean, trace?: boolean): void => {
        if((enabled || settings.developMode) && !trace)
            console.log(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);
    
        if(trace)
            console.trace(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);

        for(const msg of message) {
            this._log.writeFile(msg);
        };
    };;
    
    public static readonly Trace = () => {
        console.trace();
    };
    
    public static readonly Error = (msg?: any) => {
        if(!msg)
            return;
        
        this.WarnComponent(msg, 'error');
        console.trace();
    };

    public static readonly Warn = (msg?: any) => {
        if(!msg)
            return;
    
        this.WarnComponent(msg, 'warning');
    };
};
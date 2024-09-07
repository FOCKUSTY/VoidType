import { settings } from "config";
import Formatter, { Colors } from "utility/service/formatter.service";

export class Debug {
    public static readonly Console = console;

    private static readonly WarnComponent = (msg: string, type: 'error'|'warning') => {
        console.warn(Colors.yellow + '------------- !Внимание! --------------' + Colors.reset);

        if(type === 'error') {
            console.error(Colors.red + msg + Colors.reset);
        }
        else {
            console.warn(Colors.yellow + msg + Colors.reset);
        };

        console.warn(Colors.yellow + '------------- !Внимание! --------------' + Colors.reset);
    };

    public static readonly Log = (message: any[], enabled?: boolean, trace?: boolean): void => {
        if((enabled || settings.developMode) && !trace)
            console.log(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);
    
        if(trace)
            console.trace(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);
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
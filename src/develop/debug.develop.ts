import { settings } from "config";
import Formatter, { Colors } from "utility/service/formatter.service";

const Log = (message: any[], enabled?: boolean, trace?: boolean): void => {
    if((enabled || settings.developMode) && !trace)
        console.log(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);

    if(trace)
        console.trace(Colors.cyan + 'Debugger' + Colors.reset + ':' + Colors.magenta, ...message, Colors.reset);
};

const Trace = () => {
    console.trace();
};

const Error = (msg?: any) => {
    if(!msg)
        return;
    
    console.error(Formatter.Color(msg, Colors.red));
    console.trace();
};

export class Debug {
    public static Console = console;
    public static Log = Log;
    public static Trace = Trace;
    public static Error = Error;
};
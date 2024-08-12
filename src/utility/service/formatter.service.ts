import { format } from 'date-fns';
import fs from 'node:fs';

export enum Colors {
    reset = "\u001B[0m",

    bold = "\u001b[1m",
    italic = "\u001b[3m",
    underline = "\u001b[4m",
    reversed = "\u001b[7m",

    black = "\u001b[30m",
    blue = "\u001b[34m",
    cyan = "\u001b[36m",
    green = "\u001b[32m",
    magenta = "\u001b[35m",
    red = "\u001b[31m",
    yellow = "\u001b[33m",
    white = "\u001B[0m",
    
    brightBlack = "\u001b[30;1m",
    brightBlue = "\u001b[34;1m",
    brightGreen = "\u001b[32;1m",
    brightMagenta = "\u001b[35;1m",
    brightRed = "\u001b[31;1m",
    brightCyan = "\u001b[37m",
    brightWhite = "\u001b[37;1m",
    brightYellow = "\u001b[33;1m",

    bgBlack = "\u001b[40m",
    bgBlue = "\u001b[44m",
    bgCyan = "\u001b[46m",
    bgGreen = "\u001b[42m",
    bgMagenta = "\u001b[45m",
    bgRed = "\u001b[41m",
    bgWhite = "\u001b[47m",
    bgYellow = "\u001b[43m",
    bgBrightBlack = "\u001b[40;1m",
    bgBrightBlue = "\u001b[44;1m",
    bgBrightCyan = "\u001b[46;1m",
    bgBrightGreen = "\u001b[42;1m",
    bgBrightMagenta = "\u001b[45;1m",
    bgBrightRed = "\u001b[41;1m",
    bgBrightWhite = "\u001b[47;1m",
    bgBrightYellow = "\u001b[43;1m",
};

class Formatter {
    public static RuWords = (num: number, stage: [string, string, string]) => {
        const
            txt: string = `${num}`,
            firstChar: number = Number(txt[txt.length-1]),
            secondChar: number = Number(txt[txt.length-2]);
        
        let text = '';
        
            
        if (num === 1 || (firstChar === 1 && secondChar != 1))
            text += `${stage[0]}`;

        else if ((firstChar === 1 && secondChar === 1) || firstChar === 0 || secondChar === 1)
            text += `${stage[2]}`;
        
        else if (firstChar<5)
            text += `${stage[1]}`;

        else
            text += `${stage[2]}`;
    
        return text;
    };

    public static Color = (text: string, color: Colors) =>
        color + text + Colors.reset;

    public static Comma = (number: string) =>
        `${number}`.replace('.', ',');

    public static FromJSON = (json: string): any => {
        let file;
        JSON.stringify(json, (_, value) => { eval(`file = ${value}`) } );
        return file;
    };

    public static FromJSONwithPath = (path: string): any => {
        let file: any;
        const json = fs.readFileSync(path, { encoding: "utf-8" });
        JSON.stringify(json, (_, value) => { eval(`file = ${value}`) } );

        return file;
    };

    public static Date = (date: string | number | Date, form='dd.MM.yyyy HH:mm:ss'): string|void =>
    {
        if(!date)
            return;
    
        let dateForm: any = new Date(date);
        dateForm = format(dateForm, `${form}`);
        return dateForm;
    };
};

export default Formatter;
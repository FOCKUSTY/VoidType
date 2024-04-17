class Colors {
    public static reset = "\u001B[0m";

    public static bold = "\u001b[1m";
    public static italic = "\u001b[3m";
    public static underline = "\u001b[4m";
    public static reversed = "\u001b[7m";

    public static black = "\u001b[30m";
    public static blue = "\u001b[34m";
    public static cyan = "\u001b[36m";
    public static green = "\u001b[32m";
    public static magenta = "\u001b[35m";
    public static red = "\u001b[31m";
    public static yellow = "\u001b[33m";
    public static white = "\u001B[0m";
    
    public static brightBlack = "\u001b[30;1m";
    public static brightBlue = "\u001b[34;1m";
    public static brightGreen = "\u001b[32;1m";
    public static brightMagenta = "\u001b[35;1m";
    public static brightRed = "\u001b[31;1m";
    public static brightCyan = "\u001b[37m";
    public static brightWhite = "\u001b[37;1m";
    public static brightYellow = "\u001b[33;1m";

    public static bgBlack = "\u001b[40m";
    public static bgBlue = "\u001b[44m";
    public static bgCyan = "\u001b[46m";
    public static bgGreen = "\u001b[42m";
    public static bgMagenta = "\u001b[45m";
    public static bgRed = "\u001b[41m";
    public static bgWhite = "\u001b[47m";
    public static bgYellow = "\u001b[43m";
    public static bgBrightBlack = "\u001b[40;1m";
    public static bgBrightBlue = "\u001b[44;1m";
    public static bgBrightCyan = "\u001b[46;1m";
    public static bgBrightGreen = "\u001b[42;1m";
    public static bgBrightMagenta = "\u001b[45;1m";
    public static bgBrightRed = "\u001b[41;1m";
    public static bgBrightWhite = "\u001b[47;1m";
    public static bgBrightYellow = "\u001b[43;1m";
};

const setColor = (text: string, color: Colors) =>
{
    return color+text+Colors.reset;
};

export
{
    Colors,
    setColor
};
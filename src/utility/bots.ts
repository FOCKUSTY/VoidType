const bots = new Map();

const setBot = (name: string, boolean=true) =>
{
    bots.set(`${name}`, boolean);
};

const getBot = (name: string) =>
{
    return bots.get(`${name}`)
};

export
{
    getBot,
    setBot
};
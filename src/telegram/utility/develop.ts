import { Telegraf } from 'telegraf';

let developClient: Telegraf;

const setDevelopClient = (client: Telegraf): void =>
{
    developClient = client;
}

const getDevelopClient = (): Telegraf =>
{
    return developClient;
};

export
{
    setDevelopClient,
    getDevelopClient
}
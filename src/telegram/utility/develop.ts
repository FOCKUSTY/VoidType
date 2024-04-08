let developClient: any;

const setDevelopClient = async (client: any) =>
{
    developClient = await client;
}

const getDevelopClient = async (client: any) =>
{
    return await developClient;
};

export =
{
    setDevelopClient,
    getDevelopClient
}
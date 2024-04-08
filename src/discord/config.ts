import dotenv from "dotenv";

dotenv.config();

const
{
    ITOKEN,
    TOKEN,
    TELEGRAMTOKEN,
    BOTTOMLESSHATID,
    GUILDID,
    FARYSDID,
    KRISTYGUILDID,
    AUTHORID,
    CLIENTID,
    ICLIENTID,
    THEABYSSIAID,
    KRISTYID,
    KRISTYAUTHORID,
    IDEACHANNELID,
    CHATTINGWITHKRISTY_CHANNELID,
    LOGCHANNELID,
    LOGGUILDID,
} = process.env;

if (!TOKEN || !CLIENTID) {
    throw new Error("Missing environment variables");
}

export const config =
{
    Itoken: ITOKEN,
    token: TOKEN,
    telegramToken: TELEGRAMTOKEN,
    bottomlessHatId: BOTTOMLESSHATID,
    guildId: GUILDID,
    farySDId: FARYSDID,
    kristyGuildId: KRISTYGUILDID,
    authorId: AUTHORID,
    clientId: CLIENTID,
    IclientId: ICLIENTID,
    theAbyssiaId: THEABYSSIAID,
    kristyId: KRISTYID,
    kristyAuthorId: KRISTYAUTHORID,
    ideaChannelId: IDEACHANNELID,
    chattingWithKristyId: CHATTINGWITHKRISTY_CHANNELID,
    logChannelId: LOGCHANNELID,
    logGuildId: LOGGUILDID,
};
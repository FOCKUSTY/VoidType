import { debug } from './developConsole';
import sqlite3 from 'sqlite3';

export const ideaDB = new sqlite3.Database('./ideadb.sqlite');

ideaDB.serialize(() =>
{
  try
  {
    ideaDB.run("CREATE TABLE IF NOT EXISTS ideas (name TEXT, username, TEXT, globalname TEXT, description TEXT, guildname TEXT);");
  }
  catch (error)
  {
    console.error(error);
  }
});

export const addRowIdeaDB = (name?: string, username?: string, globalname?: string, description?: string, guildname?: string) =>
{
  if (name===undefined||name===null) name = 'Названия нет';
  if (username===undefined||username===null) username = 'Бот?';
  if (globalname===undefined||globalname===null) globalname = 'Бот?';
  if (description===undefined||description===null) description = 'Описания нет';
  if (guildname===undefined||guildname===null) guildname = 'Личные сообщения';

  try
  {
    const row = ideaDB.prepare(`INSERT INTO ideas(name, username, globalname, description, guildname) \
                                VALUES (?, ?, ?, ?, ?), \
                                ("${name}", "${username}", "${globalname}", "${description}", "${guildname}")`);
    
    row.run();
    row.finalize();
  }
  catch (e)
  {
    console.log(`Идея не была доставлена`)
    debug([e, true])
  }
};
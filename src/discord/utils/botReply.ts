import fs from 'node:fs';

let botReply: boolean = false;

function setBotReply(boolean: boolean) {  botReply = boolean };
function getBotReply() {  return botReply };

function changeReplyTxt(txt: string)
{
  fs.writeFile('./botReply.txt', txt, (err) => 
  {
      if (err) console.error(err);
      return;
  })
};

function readReplyTxt()
{
  try
  {
    const data = fs.readFileSync('./botReply.txt');
    return data;
  }
  catch (err)
  {
    console.error(err);
  }
};

export
{
    setBotReply,
    getBotReply,
    changeReplyTxt,
    readReplyTxt
};
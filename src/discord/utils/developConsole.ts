import { dateCheck } from './date';
import { setColor, Colors } from './colors'

const devDebug = false;

const debug = (args: any[] = [true], debugging: boolean = true, trace: boolean = false, isError: boolean = false) =>
{
  if(!(devDebug || debugging)) return;

  const date = new Date();

  if(isError)
  {
    console.error(setColor(`[${dateCheck(date)}]`, Colors.brightYellow), ...args);
  }
  else
  {
    console.log(setColor(`[${dateCheck(date)}]`, Colors.brightYellow), ...args);
  
    if(trace)
    {
      console.trace();
    };
  }
}

const skip = ( value = 1 ): void =>
{
  try
  {
    for (let i = 0; i < value; i++)
    {
      console.log();
    };
  }
  catch (err)
  {
    skip();
    debug([err], true, false, true);
    skip();
  };
};

export
{
 debug,
 skip
};
const devDebug = false;

const debug = (args: any[] = [true], debugging: boolean = true, trace: boolean = false, isError: boolean = false) =>
{
  if(!(devDebug || debugging)) return;

  if(isError)
  {
    console.error(...args);
  }
  else
  {
    console.log(...args);
  
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
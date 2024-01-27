const
  devDebug = false;

const debug = ( arr: any, dev = devDebug, isLog = false, isTrace = false): void =>
{
  let arg = arr[0]
  
  if(!Array.isArray(arr) && ( arr[1] || devDebug ) ) arg = arr
  else
  {
    
    console.error(arg);
    console.trace(arg);
    return;

  };
  
  try
  {
    if(devDebug || dev)
    {

      if(isLog)     console.log(arg);
      if(isTrace)   console.trace(arg);

    }
    else console.log(arg);
  }
  catch (err)
  {
    console.log(err);
  };
};

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
    console.log();
    debug([err, true]);
    console.log();
  }
};

export
{
 debug,
 skip
}
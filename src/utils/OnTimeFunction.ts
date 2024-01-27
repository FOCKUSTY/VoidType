const oneTimeFunctionCache = new Map();

const oneTimeFunction = (name: string, boolean=true, isUpdate=false, isGet=false) =>
{
  if(isGet) return oneTimeFunctionCache.get(name)

  else if(isUpdate) oneTimeFunctionCache.set(name, boolean);

  else if(oneTimeFunctionCache.get(name)) return;
  
  else oneTimeFunctionCache.set(name, boolean);  
};

class OnTime
{
  
  _boolean_: boolean;
  name: string;

  constructor(_boolean_: boolean, _name_: string)
  {
    this._boolean_ = _boolean_;
    this.name = _name_;
  };

  set boolean(_boolean_)
  {
    this._boolean_ = _boolean_;
    return;
  };

  get boolean()
  {
    return this._boolean_;
  };

  oneTimeFunction(_boolean_=true, isUpdate=false, isGet=false)
  {

    if(isGet) return oneTimeFunctionCache.get(this.name)

    else if(isUpdate) oneTimeFunctionCache.set(this.name, _boolean_);

    else if(oneTimeFunctionCache.get(this.name)) return;
    
    else oneTimeFunctionCache.set(this.name, _boolean_);
  };
}

export
{
  oneTimeFunction,
  OnTime
};
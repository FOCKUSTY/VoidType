import { dateCheck } from './date';
import { debug, skip } from './developConsole';
import { Random } from 'random-js';
const random = new Random();

let historyArray: any[] = [];
const allRandomNumbers: number[] = [];

const checkMinus = (num: number) =>
{
 if (num < 0) return -num
 else return num;
};

const checkInfinity = (num: number, func: any) =>
{
  if(num === (Infinity || -Infinity)) func()
  else return;
}

const checkNull = (num: number, plusRandom=false) =>
{
  if(num === 0)
  {
    if(!plusRandom) return num + 1
    else return num + Math.round(Math.random()*1000);
  }
  else return num;
};

const chanceBetween = ( chance=50, funcOne: any, funcTwo: any, num=random.integer(0,100) ) =>
{
  if(num < chance) funcOne()
  else funcTwo();
};
  
const historyPseudoRandomNumber = (min: number, max: number, n: number, m: number, arr: any[], yourArr: any[], array: any[], num: number) =>
{
  function checkArrays()
  {
    if(yourArr.length === max)
    {
      for(let el of array)
      {
        if(yourArr[num] === el)
        {
          debug([`Было найдено совпадения элементов\nСтарое число: ${num}`]);
          num = pseudoRandomNumber(min, max, n, m, arr, undefined, undefined, false, true, true);
          debug([`Новое число: ${num}`]);
          checkArrays();
        };
      };
    };
  };
  checkArrays();
  
  array.push(yourArr[num]);
  
  if(array.length>n)
  {
    array.shift();
    array.shift();
  };

  return num;
};

const historyRandom = (num: number, min=0, max=100, array: any[], n=3, dOaF=1, pseudoRandom=false) =>
{
  let
    iMin,
    iMax;

  function check()
  {
    for(let i of array)
    {
      iMin = i-dOaF;
      iMax = i+dOaF;
      if( num===i || ( num > iMin && num < iMax ) )
      {
        debug([`Область определения от ${ iMin } до ${ iMax }`]);
        debug([`Число: ${ num }`]);
        
        if( !pseudoRandom ) num = random.integer(min, max)
        else num = pseudoRandomNumber(min, max, n, dOaF, array, undefined, undefined, false, false, false);
        
        debug([`Новое число: ${ num }`]);
        console.log();
      };
    };
  };

  for (let {} of array) check();
  check();
  array.push( num );

  if(array.length > n)
  {
    array.shift();
    array.shift();
  };

  return num;
};

/* function pseudoRandomNumber(min=0, max=100, n=3, m=2, arr=historyArray, yourArr=null, array=null, history=true, chanceNull=true, chanceMax=true)
{

    someMin = checkMinus( checkNull( min, false )  );
    someMax = checkMinus( checkNull( max, true  )   );
    let oRNum = checkNull( Math.round( ( Math.random() * someMax ) + ( Math.random() * ( -someMax ) ) ), true ),
        tRNum = checkNull( Math.round( ( Math.random() * someMax ) + ( Math.random() * ( -someMax ) ) ), true );

    function checkEqual()
    {
        if(someMin === someMax)
        {
            someMin = 1;
            someMax = Math.random()*1000;
            checkEqual();
        };
    };
    checkEqual();

    let someNumber = Math.random(),
        string = `${someNumber}`,
        num = Number( string.slice( Math.round( string.length/2 ), Math.round( string.length/2 + `${ someMax }`.length ) ) );

    if(max > 1255121) someNumber = Math.round(oRNum * tRNum * someNumber)
    else someNumber = Math.round(oRNum * tRNum * someNumber * (10**(`${someNumber}`.length)) / num);
  
    let period = 1,
        periodMax = 10;
    
    function someFunc()
    {
      period++;
      let somePeriod = periodMax ** period;
      someNumber = Math.round( oRNum * tRNum * ( Math.random() * ( 100/somePeriod ) ) );
    };
    checkInfinity( someNumber, someFunc );

    string = `${someNumber}`;
    num = Number( string.slice( Math.round( string.length/2 ), Math.round( string.length/2 + ( `${ someMax }`.length ) ) ) );
    
    function checkMax()
    {
      if(num > someMax)
      {
        num = checkMinus( checkNull( num, true ) ) - checkMinus( checkNull ( someMax, true ) );
        checkMax();
      }
    };
    
    checkMax();
    
    num = Math.round( checkMinus(num) );
    
    if(chanceNull)
    {
        function one() 
        {
          num = num-num
        };

        function two() 
        {
            num = num
        };

        chanceBetween( 5, one, two, pseudoRandomNumber( 0, 100, n, m, arr, null, null, false, false, false ) );
    };
    
    if( chanceMax )
    {
        let minusNumber;
        function three() {
            return minusNumber = Math.round( Math.random() * 10 );
        };
        function four() {
            return minusNumber = 0;
        };
        chanceBetween( 15, three, four, pseudoRandomNumber( 0, 100, n, m, arr, null, null, false, false, false ) );

        function one_()
        {
            num=max - minusNumber;
        };
        function two_()
        {
            num=num;
        };
        chanceBetween( 5, one_, two_, pseudoRandomNumber( 0, 100, n, m, arr, null, null, false, false, false ) );
    };

    if(history) num = historyRandom(num, min, max, arr, n, m, false);
    if( yourArr && array && history ) num = historyPseudoRandomNumber(min, max, n, m, arr, yourArr, array, num);
    
    if(num === NaN || num === null || num === undefined)
    {
      num = pseudoRandomNumber(min, max, n, m, arr, null, null, false, true, true);
      num = checkMinus(num);
    };

    return num;
}; */

function pseudoRandomNumber(min=0, max=100, n=3, m=2, historyArr=historyArray, yourArr?: any[], array?: any[], history:any = true, chanceNull=true, chanceMax=true)
{
  let
    someMin,
    someMax;
  
  if(min === max)
  {
    if(max === 0) max +=100;
    
    min = 0;
  };

  let random = Math.round(Math.random()*1000);
  if(allRandomNumbers.length != 0) random = allRandomNumbers[allRandomNumbers.length-1];
  
  if(random === 0)
    random += 1;

  if(min===0) someMin = min + 1;
  else someMin = min;
  someMax = max * random;

  let seconds = Number(dateCheck(Date.now(), 'mm'));
  let minutes = Number(dateCheck(Date.now(), 'ss'));
  let hours = Number(dateCheck(Date.now(), 'HH'));

  if(seconds === 0) seconds += 1;
  if(minutes === 0) minutes += 1;
  if(hours === 0) hours += 1;

  const first = someMin * someMax + ((someMax - someMin) * someMax) + random**2
  const second = random * random * (someMax ** 2)
  const third = Date.now()/10000/random;
  const fourth = (seconds / minutes / hours);

  debug(['first', first], false);
  debug(['second', second], false);
  debug(['third', third], false);
  debug(['fourth', fourth], false);

  const
    maxLength = `${max}`.length, minLength = `${min}`.length,

    randomNumber = BigInt(`${(first + second) * (third + fourth) / (maxLength ** minLength * 100)}`.replace('.', '')),

    text = `${randomNumber}`;

  debug(['Random: ', random], false);
  
  debug(
    ['Date: ',
    `Minutes: ${Number(dateCheck(Date.now(), 'mm'))}`,
    `Seconds: ${Number(dateCheck(Date.now(), 'ss'))}`,
    `Hours: ${Number(dateCheck(Date.now(), 'HH'))}`
    ], false);
  debug(['New random: ', randomNumber], false);

  debug(['Max: ', max], false);
  debug(['Min: ', min], false);
  debug(['allRandomNumbers', allRandomNumbers], false);
  
  let number = Number( text.slice( Math.round(text.length/2), Math.round(text.length/2+maxLength) ) );
  
  allRandomNumbers.push(number);
  
  function checkMax()
  {
    if(number > max)
    {
      number = checkMinus( checkNull( number, true ) ) - checkMinus( checkNull ( max, true ) );
      debug([number], false);
      checkMax();
    }
  };

  checkMax();

  if(chanceNull)
  {
    chanceBetween(5, ()=>{ number = 0 }, ()=>{ number = number }, pseudoRandomNumber( 0, 100, n, m, array, undefined, undefined, false, false, false ) );
  };

  if(chanceMax)
  {
    chanceBetween(5, ()=>{ number = max }, ()=>{ number = number }, pseudoRandomNumber( 0, 100, n, m, array, undefined, undefined, false, false, false ) );
  };
  
  if(history) number = historyRandom(number, min, max, historyArr, n, m, false);
  if( yourArr && array && history ) number = historyPseudoRandomNumber(min, max, n, m, historyArr, yourArr, array, number);

  debug(['Number: ',number], true);

  return number;
}

export
{
  pseudoRandomNumber,
  historyPseudoRandomNumber,
  historyRandom,
  checkMinus,
  checkInfinity,
  checkNull,
  chanceBetween,
}
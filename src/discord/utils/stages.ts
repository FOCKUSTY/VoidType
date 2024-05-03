const checkNumber = (num: number, object: any) =>
{
    const
        txt: string = `${num}`,
        firstChar: number = Number(txt[txt.length-1]),
        secondChar: number = Number(txt[txt.length-2]);
    
    let stage;
    let text = '';
    
    for(let element in object)
    {
        stage = object[element];
        
        if (num === 1 || (firstChar === 1 && secondChar != 1))
            text += `${stage[0]}`;

        else if ((firstChar === 1 && secondChar === 1) || firstChar === 0 || secondChar === 1)
            text += `${stage[2]}`;
        
        else if (firstChar<5)
            text += `${stage[1]}`;

        else
            text += `${stage[2]}`;
    };

    return text;
};

export
{
    checkNumber
}
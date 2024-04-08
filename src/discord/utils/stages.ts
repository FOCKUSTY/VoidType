const checkNumber = (num: number, object: any) =>
{
    const
        txt: string = `${num}`,
        cO: number = Number(txt[txt.length-1]),
        cT: number = Number(txt[txt.length-2]);
    
    let stage;
    let text = '';
    
    for(let el in object)
    {
        stage = object[el]
        
        if ((num==1) || (cO==1 && cT!=1)) text += `${stage[0]}`
        else if ((cO==1 && cT==1) || (cO==0) || (cT==1)) text += `${stage[2]}`
        else if (cO<5) text += `${stage[1]}`
        else text += `${stage[2]}`;
    };

    return text;
};

export
{
    checkNumber
}
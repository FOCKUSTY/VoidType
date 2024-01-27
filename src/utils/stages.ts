const checkNumber = (num: number, stages: any): string|void =>
{
    const
        txt = `${num}`,
        cO: number = Number(txt[txt.length-1]),
        cT: number = Number(txt[txt.length-2]);
    
    let someStage;
    let text = '';
    
    for(let el in stages)
    {
        someStage = stages[el]
        
        if ((num==1) || (cO==1 && cT!=1)) text += `${someStage[0]} `
        else if ((cO==1 && cT==1) || (cO==0) || (cT==1)) text += `${someStage[2]} `
        else if (cO<5) text += `${someStage[1]} `
        else text += `${someStage[2]} `;

    };

    return text;

};

export
{
    checkNumber
}
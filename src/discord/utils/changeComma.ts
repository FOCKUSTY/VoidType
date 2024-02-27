const changeComma = (number=0.5) =>
{
    const textNumber = `${number}`.replace('.', ',');
    return textNumber;
};

export
{
    changeComma
};
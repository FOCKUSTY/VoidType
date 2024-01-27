const copy = (obj: any) =>
{
    function copyProps (clone: any)
    {
        for (let key in obj)
        {
            if (Object.prototype.hasOwnProperty.call(obj, key))
            {
                clone[key] = copy(obj[key]);
            };
        };
    };

    /**
    * Создание иммутабельной копии объекта
    * @return {Object}
    */
    function cloneObj ()
    {
        let clone = {};
        copyProps(clone);
        return clone;
    };

    /**
    * Создание иммутабельной копии массива
    * @return {Array}
    */
    function cloneArr ()
    {
        return obj.map(function (item: any)
        {
            return copy(item);
        });
    }

    /**
    * Создание иммутабельной копии Map
    * @return {Map}
    */
    function cloneMap ()
    {
        let clone = new Map();
        for (let [key, val] of obj)
        {
            clone.set(key, copy(val));
        };
        return clone;
    }

    /**
    * Создание иммутабельной копии Set
    * @return {Set}
    */
    function cloneSet ()
    {
        let clone = new Set();
        for (let item of obj)
        {
            clone.add(copy(item));
        }
        return clone;
    }

    /**
    * Создание иммутабельной копии функции
    * @return {Function}
    */
    function cloneFunction (this: any)
    {
        let clone = obj.bind(this);
        copyProps(clone);
        return clone;
    } 

    // Получение типа объекта
    let type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

    // Возвращаем копию в зависимости от типа исходных данных

    switch (type)
    {
        case 'object':
            return cloneObj();

        case 'array':
            return cloneArr();

        case 'map':
            return cloneMap();

        case 'set':
            return cloneSet();

        case 'function':
            return cloneFunction();
    };

    return obj;
}

export
{
    copy
}
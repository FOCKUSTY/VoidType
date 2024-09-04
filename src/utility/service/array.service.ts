class SelfArray extends Array {
    public static Shuffle = ( array: any[] ) =>
    {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex > 0)
        {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
      
        return array;
    };

    public static Copy = (obj: any) =>
    {
        function copyProps (clone: any)
        {
            for (let key in obj)
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    clone[key] = SelfArray.Copy(obj[key]);
        };
    
        function cloneObj (): object
        {
            let clone = {};
            copyProps(clone);
            return clone;
        };
    
        function cloneArr (): any[]
        {
            return obj.map(function (item: any)
            {
                return SelfArray.Copy(item);
            });
        }
    
        function cloneMap (): Map<any, any>
        {
            let clone = new Map();
            for (let [key, val] of obj)
                clone.set(key, SelfArray.Copy(val));
            return clone;
        }
    
        function cloneSet (): Set<any>
        {
            let clone = new Set();
            for (let item of obj)
                clone.add(SelfArray.Copy(item));
            return clone;
        }
    
        function cloneFunction (this: any): Function
        {
            let clone = obj.bind(this);
            copyProps(clone);
            return clone;
        } 
    
        let type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    
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
};

export default SelfArray;
import { ActivityType, Client as DiscordClient } from "discord.js";

import { ActivityTypes } from "types/activities/activities.enum";
import { Activity } from "types/activities/standart-activity.type";

import { Debug } from 'develop/debug.develop';
import Logger from 'logger/index.logger';

import { activities as loadedActivities } from "utility/loaders/activities.loader";
import ClientLoader from "utility/loaders/client.loader";

import PseudoRandom from "./pseudo-random.service";
import Formatter from "./formatter.service";
import Array from "./array.service";

const historyObject = new Map();

class RandomActiviy {
    private readonly Logger = new Logger('Activity').execute;
    
    private readonly _client: DiscordClient;
    private readonly _clientLoader = new ClientLoader();

    private readonly _preffix: string = '';
    private readonly _setActivity: boolean = true;

    constructor(client: DiscordClient, preffix: string = '', setActivity: boolean = true) {
        this._client = client;
        this._preffix = preffix === '' ? '' : ' | ' + preffix;
        this._setActivity = setActivity;
    };

    private readonly Typified = async (type: 'user'|'guild'|'name'): Promise<Activity> => {
        try {
            if(!this._client.user)
                return { text: 'cmd: Error', type: 'custom' };

            const history = historyObject.get(type) ? historyObject.get(type) : [];
            historyObject.set(type, history);

            const activities = Array.Shuffle(loadedActivities[type === 'guild' ? 'guild' : 'name']);

            const randomActivityNumber = new PseudoRandom().Number(0, activities.length-1, history, activities, this._setActivity);
            const randomActivity = activities[randomActivityNumber];
        
            const array = this._clientLoader.Get(type);
        
            const firstRandomElementNumber = new PseudoRandom().Number(0, array.length-1, history, array, this._setActivity);
            const secondRandomElementNumber = new PseudoRandom().Number(0, array.length-1, history, array, this._setActivity);
        
            const firstRandomElement = array[firstRandomElementNumber];
            const secondRandomElement = array[secondRandomElementNumber];
        
            const text: string = randomActivity.text
                .replace('{random}', firstRandomElement)
                .replace('{randomTwo}', secondRandomElement)
                + this._preffix;
        
            if(this._setActivity)
                Debug.Log([`Случайные элементы: ${firstRandomElement} & ${secondRandomElement} из ${array.length}`]);
    
            return { text: text, type: randomActivity.type };
        } catch (err) {
            Debug.Error(err);

            return { text: 'cmd: Error', type: 'custom' }
        };
    };

    private readonly Standart = async (): Promise<Activity> => {
        try {
            if(!this._client.user)
                return { text: 'cmd: Error', type: 'custom' };

            const history = historyObject.get('activities') ? historyObject.get('activities') : [];
            historyObject.set('activities', history);
    
            const activities = Array.Shuffle(loadedActivities['other']);
            
            const randomActivityNumber = new PseudoRandom().Number(0, activities.length-1, history, activities, this._setActivity);
            const randomActivity: Activity = activities[randomActivityNumber];
    
            return { text: randomActivity.text + this._preffix, type: randomActivity.type };
        } catch (err) {
            Debug.Error(err);
            return { text: 'cmd: Error', type: 'custom' };
        };
    };

    public readonly execute = async (): Promise<Activity> => {
        if(!this._client.user)
            return { text: 'cmd: Error', type: 'custom' };
    
        const history = historyObject.get('number-activity') ? historyObject.get('activities') : [];
        historyObject.set('number-activity', history);
    
        const randomChance = new PseudoRandom().Number(0, 100, history, undefined, this._setActivity);

        const Log = (activity: Activity) =>
        {
            if(this._setActivity)
                this.Logger(`Устанавливаю активность: "${activity.text}", тип: ${activity.type}`);
            
            return { text: activity.text, type: activity.type };
        };
    
        if(this._setActivity)
            Debug.Log(['Chance:', randomChance]);
    
        if(randomChance <= 10)
        {
            const length = this._clientLoader.guilds.length;
            const word = Formatter.RuWords(length, ['сервере', 'серверах', 'серверах']);
    
            const text = `Я уже на ${length} ${word}`;

            if(this._setActivity)
                this._client.user.setActivity({ name: text, type: ActivityType.Custom });
    
            return Log({text, type: 'custom' });
        }
    
        if(randomChance >= 10 && randomChance <= 40)
        {
            let type: 'user'|'guild'|'name';
    
            if(randomChance >= 10 && randomChance <= 20) type = 'user';
            else if(randomChance >= 20 && randomChance <= 30) type = 'guild';
            else type = 'name';
    
            const activity = await this.Typified(type);
    
            if(this._setActivity)
                this._client.user.setActivity({name: activity.text, type: Number(ActivityTypes[activity.type]) });

            return Log(activity);
        };
    
        if(randomChance >= 40)
        {
            const activity = await this.Standart();
            
            if(this._setActivity)
                this._client.user.setActivity({name: activity.text, type: Number(ActivityTypes[activity.type])});

            return Log(activity);
        };

        return { text: 'cmd: Error', type: 'custom' };
    };
};

export default RandomActiviy;
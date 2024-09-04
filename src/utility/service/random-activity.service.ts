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
    private readonly _client: DiscordClient;
    private readonly _clientLoader = new ClientLoader();
    private readonly Logger = new Logger('Activity').execute;

    constructor(client: DiscordClient) {
        this._client = client;
    };

    private readonly Typified = async (type: 'user'|'guild'|'name'): Promise<Activity|void> => {
        try {
            if(!this._client.user)
                return;

            const history = historyObject.get(type) ? historyObject.get(type) : [];
            historyObject.set(type, history);
    
            const activities = Array.Shuffle(loadedActivities[type === 'guild' ? 'guild' : 'name']);
            
            const randomActivityNumber = PseudoRandom.Number(0, activities.length-1, history, activities);
            const randomActivity = activities[randomActivityNumber];
        
            const array = this._clientLoader.Get(type);
        
            const firstRandomElementNumber = PseudoRandom.Number(0, array.length-1, history, array);
            const secondRandomElementNumber = PseudoRandom.Number(0, array.length-1, history, array);
        
            const firstRandomElement = array[firstRandomElementNumber];
            const secondRandomElement = array[secondRandomElementNumber];
        
            const text = randomActivity.text
                .replace('{random}', firstRandomElement)
                .replace('{randomTwo}', secondRandomElement);
        
            const activityType = ActivityTypes[randomActivity.type];
        
            Debug.Log([`Случайные элементы: ${firstRandomElement} & ${secondRandomElement} из ${array.length}`]);
    
            this._client.user.setActivity({ name: text, type: Number(activityType)});
        
            return { text: text, type: randomActivity.type };
        } catch (err) {
            return Debug.Error(err);
        };
    };

    private readonly Standart = async (): Promise<Activity|void> => {
        try {
            if(!this._client.user)
                return;

            const history = historyObject.get('activities') ? historyObject.get('activities') : [];
            historyObject.set('activities', history);
    
            const activities = Array.Shuffle(loadedActivities['other']);
            
            const randomActivityNumber = PseudoRandom.Number(0, activities.length-1, history, activities);
            const randomActivity: Activity = activities[randomActivityNumber];
    
            const activityType = ActivityTypes[randomActivity.type];
            const acitivityText = randomActivity.text;
    
            this._client.user.setActivity({ name: acitivityText, type: Number(activityType)});
        
            return { text: randomActivity.text, type: randomActivity.type };
        } catch (err) {
            return Debug.Error(err);
        };
    };

    public readonly execute = async () => {
        if(!this._client.user)
            return;
    
        const history = historyObject.get('number-activity') ? historyObject.get('activities') : [];
        historyObject.set('number-activity', history);
    
        const randomChance = PseudoRandom.Number(0, 100, history);

        const Log = (activity: Activity|void) =>
        {
            if(!activity)
                return;
    
            return this.Logger(`Устанавливаю активность: "${activity.text}", тип: ${activity.type}`);
        };
    
        Debug.Log(['Chance:', randomChance]);
    
        if(randomChance <= 10)
        {
            const length = this._clientLoader.guilds.length;
            const word = Formatter.RuWords(length, ['сервере', 'серверах', 'серверах']);
    
            const text = `Я уже на ${length} ${word}`;
            this._client.user.setActivity({ name: text, type: ActivityType.Custom });
    
            return Log({text, type: 'custom'});
        }
    
        if(randomChance >= 10 && randomChance <= 40)
        {
            let type: 'user'|'guild'|'name';
    
            if(randomChance >= 10 && randomChance <= 20) type = 'user';
            else if(randomChance >= 20 && randomChance <= 30) type = 'guild';
            else type = 'name';
    
            const activity = await this.Typified(type);
    
            return Log(activity);
        };
    
        if(randomChance >= 40)
        {
            const activity = await this.Standart();
            
            return Log(activity);
        };
    };
};

export default RandomActiviy;
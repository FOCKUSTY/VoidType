export interface Activity {
    text: string;
    type: 'custom' | 'listen' | 'playing' | 'watching';
};
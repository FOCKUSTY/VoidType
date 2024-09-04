export interface Activity {
    text: string;
    type: 'custom' | 'listening' | 'playing' | 'watching';
};
import mongoose from 'mongoose';
import { config } from '../config/config';

function singleton<T extends {new (...args: any[]) :any}>(constructor : T) {
    let instance: any;

    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            if (!instance) {
                instance = this;
            }
            return instance;
        }
    }
}

@singleton 
export class Database {
    private connection: string = '';

    public constructor() {
        console.log('Database instance created');
    }

    public async connectToDatabase() {
        try {
            if (!config.database.url) {
                throw new Error('Database URL is not defined');
            }
            this.connection = config.database.url;
            await mongoose.connect(this.connection);
            console.log('Connected to the database successfully');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }
}



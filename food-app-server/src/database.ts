import mongoose from 'mongoose';
import config from './config/config';

export async function connectDB() {
    const { host, user, pass, name } = config.db;
    if (!host || !user || !pass || !name) {
        console.error('FATAL: DB env vars missing.');
        process.exit(1);
    }
    const uri = `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log('MongoDB connected');
}

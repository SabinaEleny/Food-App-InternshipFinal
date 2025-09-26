import { App } from './app';
import { connectDB } from './database';

const startServer = async () => {
    await connectDB();

    const server = new App();
    server.start();
};

startServer();
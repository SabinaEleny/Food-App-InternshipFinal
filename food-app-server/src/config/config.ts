import dotenv from 'dotenv';
dotenv.config();

type Config = {
    port: number;
    nodeEnv: string;
    corsOrigin: string;
    db: { host?: string; user?: string; pass?: string; name?: string };
    jwtSecret?: string;
};

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
};

export default config;

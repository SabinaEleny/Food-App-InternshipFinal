"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
async function connectDB() {
    const { host, user, pass, name } = config_1.default.db;
    if (!host || !user || !pass || !name) {
        console.error('FATAL: DB env vars missing.');
        process.exit(1);
    }
    const uri = `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`;
    await mongoose_1.default.connect(uri);
    console.log('MongoDB connected');
}

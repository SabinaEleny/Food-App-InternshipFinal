"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const chat_service_1 = require("../services/chat.service");
async function runTest() {
    console.log('--- STARTING BACKEND AI TEST ---');
    // Conectam la baza de date la inceputul scriptului
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in .env file');
    }
    console.log('⏳ Connecting to database...');
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully.');
    try {
        const mockUser = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name: 'Test User',
            email: 'test@example.com',
        };
        const chatService = new chat_service_1.ChatService();
        const questions = [
            'what should I do if an item is missing from my order?',
            'what is the best pizza topping?',
            "I'm very angry, I received a pizza instead of the sushi I ordered! This is completely wrong.",
        ];
        for (const question of questions) {
            console.log(`\n==================================================`);
            console.log(`> USER ASKS: "${question}"`);
            console.log(`==================================================`);
            console.log(`⏳ Getting AI response...`);
            const result = await chatService.processMessage(mockUser, question);
            console.log(`\n💬 AI RESPONSE:`);
            console.log(result.reply);
            console.log(`--------------------------------------------------`);
        }
    }
    catch (error) {
        // Prindem erorile din timpul testului
        console.error('An error occurred during the test execution:', error);
    }
    finally {
        // Indiferent daca testul reuseste sau esueaza, ne deconectam de la DB
        console.log('\n⏳ Disconnecting from database...');
        await mongoose_1.default.disconnect();
        console.log('✅ Database disconnected.');
    }
    console.log('\n--- AI TEST FINISHED ---');
    process.exit(0);
}
runTest().catch((error) => {
    console.error('A critical error occurred:', error);
    process.exit(1);
});

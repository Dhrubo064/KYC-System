"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'kyc_queue';
    }
    // Connect to RabbitMQ
    async connect() {
        try {
            const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
            this.connection = await amqplib_1.default.connect(rabbitUrl);
            if (this.connection) {
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue(this.queueName, {
                    durable: true
                });
            }
            console.log('✅ RabbitMQ connected successfully');
        }
        catch (error) {
            console.error('❌ RabbitMQ connection error:', error);
            throw error;
        }
    }
    // Send a message to the queue
    async sendToQueue(message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            const sent = this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
            return sent;
        }
        catch (error) {
            console.error('Error sending to queue:', error);
            return false;
        }
    }
    // Consume messages from the queue
    async consumeQueue(callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            this.channel.prefetch(1);
            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        this.channel.ack(msg);
                    }
                    catch (error) {
                        console.error('Error processing message:', error);
                        this.channel.nack(msg, false, false);
                    }
                }
            });
            console.log('✅ Started consuming from queue');
        }
        catch (error) {
            console.error('Error consuming queue:', error);
            throw error;
        }
    }
    // Close the connection to RabbitMQ
    async close() {
        try {
            if (this.channel)
                await this.channel.close();
            if (this.connection)
                await this.connection.close();
        }
        catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
}
exports.default = new RabbitMQConnection();

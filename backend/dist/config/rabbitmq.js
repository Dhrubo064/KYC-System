"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib"));
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
            this.connection = await amqp.connect(rabbitUrl);
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

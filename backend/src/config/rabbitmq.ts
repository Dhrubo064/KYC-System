import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queueName = 'kyc_queue';

  async connect(): Promise<void> {
    try {
      const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertQueue(this.queueName, {
        durable: true
      });
      
      console.log('✅ RabbitMQ connected successfully');
    } catch (error) {
      console.error('❌ RabbitMQ connection error:', error);
      throw error;
    }
  }

  async sendToQueue(message: any): Promise<boolean> {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      const sent = this.channel!.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      
      return sent;
    } catch (error) {
      console.error('Error sending to queue:', error);
      return false;
    }
  }

  async consumeQueue(callback: (message: any) => Promise<void>): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel!.prefetch(1);
      
      this.channel!.consume(this.queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel!.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel!.nack(msg, false, false);
          }
        }
      });
      
      console.log('✅ Started consuming from queue');
    } catch (error) {
      console.error('Error consuming queue:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

export default new RabbitMQConnection();
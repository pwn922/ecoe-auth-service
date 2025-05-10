import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { IUserEventsOutPort } from 'src/auth/application/ports/out/user-event.out.port';

@Injectable()
export class RabbitMQServiceAdapter
  implements OnModuleInit, OnModuleDestroy, IUserEventsOutPort {
    private connection: AmqpConnectionManager;
    private channelWrapper: ChannelWrapper;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        const uri = this.configService.get<string>('RABBITMQ_URI');
        if (!uri) {
            throw new Error('RABBITMQ_URI is not defined in the configuration');
        }

        this.connection = amqp.connect([uri]);
        this.channelWrapper = this.connection.createChannel({
            setup: (channel: Channel) =>
            channel.assertQueue('student_registration', { durable: true }),
        });
    }

    async emitStudentRegistered(userId: string): Promise<void> {
        const message = { userId };
        const buffer = Buffer.from(JSON.stringify(message));

        try {
            await this.channelWrapper.sendToQueue(
                'student_registration', 
                buffer, {
                    persistent: true,
                }
            );
            console.log(`Event sent: ${JSON.stringify(message)}`);
        } catch (error) {
            console.error('Failed to send message', error);
            throw new Error('Failed to send message to student_registration queue');
        }
    }

    async onModuleDestroy() {
        try {
            await this.channelWrapper.close();
            await this.connection.close();
        } catch (error) {
            console.error('Error closing RabbitMQ connections:', error);
        }
    }
}

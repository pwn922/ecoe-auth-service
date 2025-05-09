import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    const configService = app.get(ConfigService);
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
    });

    const rabbitUri = configService.get<string>('RABBITMQ_URI');
    if (!rabbitUri) {
        throw new Error('RABBITMQ_URI is not defined');
    }

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [rabbitUri],
            queue: 'student_registration',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();

    await app.listen(3000);
    
    app.useGlobalPipes(new ValidationPipe());
}

bootstrap();

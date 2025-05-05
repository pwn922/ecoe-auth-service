import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    const configService = app.get(ConfigService);
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();

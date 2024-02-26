import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as process from "process";

declare const module: any;

async function bootstrap() {
    const port = process.env.NESTJS_APP_DOCKER_PORT
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Stock prices API')
        .setDescription('Stock prices API description')
        .setVersion('1.0')
        .addTag('stock-prices')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);
    app.enableCors();

    await app.listen(port).then((_value) => {
        console.log(`Server started at http://localhost:${port}`)
        console.log(`API documentation available at http://localhost:${port}/api-docs`)
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();

import {NestFactory} from '@nestjs/core';
// import * as process from "node:process";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import initSwagger from "./utils/initSwagger";

async function bootstrap(): Promise<void> {

	const PORT = process.env.PORT || 3000;
	const app = await NestFactory.create(AppModule);

	new initSwagger(app);


	await app.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`)
	});
}

bootstrap();

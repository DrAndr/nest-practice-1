import {NestFactory} from '@nestjs/core';
// import * as process from "node:process";
import {AppModule} from "./app.module";

async function bootstrap(): Promise<void> {

	const PORT = process.env.PORT || 3000;
	const app = await NestFactory.create(AppModule);

	await app.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`)
	});
}

bootstrap();

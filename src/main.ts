import {NestFactory} from '@nestjs/core';
import {AppModule} from "./app.module";
import initSwagger from "./utils/initSwagger";
import {TransformInterceptor} from "./utils/interceptors/TransformInterceptor";
import {GlobalExceptionsFilter} from "./utils/filters/GlobalExceptionsFilter";

async function bootstrap(): Promise<void> {

	const PORT = process.env.PORT || 3000;
	const app = await NestFactory.create(AppModule);

	new initSwagger(app);

	app.useGlobalInterceptors(new TransformInterceptor())

	app.useGlobalFilters(new GlobalExceptionsFilter())

	await app.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`)
	});
}

bootstrap();

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWTToken: string;
			BASE_URL: string;
			MONGO_PORT: string;
			MONGO_HOST: string;
			MONGO_USER: string;
			MONGO_PASSWORD: string;
			MONGODB_DATABASE: string;
			TOKEN: string;
			INVURL: string;
		}
	}
}

export {};

export const WEB_PORT = 4030;
export const APP_PORT = 4031;
export const SERVER_PORT = 4032;
export const DATABASE_PORT = 55433;
export const DATABASE_BASE_URL = `postgresql://test:test@127.0.0.1:${DATABASE_PORT}`;
export const DATABASE_CONTAINER_NAME = "zbav-seme-e2e-postgres";
export const DATABASE_VOLUME_NAME = "zbav-seme-e2e-postgres-data";

export const WEB_ORIGIN = `http://127.0.0.1:${WEB_PORT}`;
export const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;
export const SERVER_ORIGIN = `http://127.0.0.1:${SERVER_PORT}`;

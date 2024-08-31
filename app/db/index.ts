// const globalForDb = globalThis as unknown as {
//   conn: postgres.Sql | undefined;
// };

// const conn = globalForDb.conn ?? postgres(serverEnv().DATABASE_URL);
// if (serverEnv().NODE_ENV !== "production") {
//   globalForDb.conn = conn;
// }

// export const db = drizzle(conn, { schema });

export { };


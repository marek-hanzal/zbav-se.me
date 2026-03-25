import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pg = require("pg") as typeof import("pg");
const { Pool, DatabaseError } = pg;

export { DatabaseError, Pool };

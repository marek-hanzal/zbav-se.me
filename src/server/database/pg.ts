import { types } from "pg";
import Pool from "pg-pool";
import { DatabaseError } from "pg-protocol";

const { DATE, TIMESTAMP, TIMESTAMPTZ } = types.builtins;

types.setTypeParser(DATE, (value) => value);
types.setTypeParser(TIMESTAMP, (value) => value);
types.setTypeParser(TIMESTAMPTZ, (value) => value);

export { DatabaseError, Pool };

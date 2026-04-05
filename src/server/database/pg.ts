import { DateTime } from "luxon";
import { types } from "pg";
import Pool from "pg-pool";
import { DatabaseError } from "pg-protocol";

const { DATE, TIMESTAMP, TIMESTAMPTZ } = types.builtins;

types.setTypeParser(DATE, (value) => {
	return DateTime.fromISO(value).toISODate();
});

types.setTypeParser(TIMESTAMP, (value) => {
	return DateTime.fromISO(value).toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
});

types.setTypeParser(TIMESTAMPTZ, (value) => {
	return DateTime.fromISO(value).toUTC().toISO();
});

export { DatabaseError, Pool };

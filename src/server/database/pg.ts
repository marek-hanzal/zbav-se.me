import Pool from "pg-pool";
import { DatabaseError } from "pg-protocol";

// const { DATE, TIMESTAMP, TIMESTAMPTZ } = types.builtins;

/**
 * Parse PostgreSQL date value safely.
 * PostgreSQL may return dates in various formats depending on server config.
 */
// const parsePgDate = (value: string, format: string): string => {
// 	try {
// 		// Try ISO format first
// 		const dt = DateTime.fromISO(value);
// 		if (dt.isValid) {
// 			return dt.toFormat(format);
// 		}
// 	} catch {
// 		// Ignore parsing errors
// 	}
// 	try {
// 		// Try SQL format (YYYY-MM-DD HH:mm:ss)
// 		const dt = DateTime.fromFormat(value, "yyyy-MM-dd HH:mm:ssxxxx");
// 		if (dt.isValid) {
// 			return dt.toFormat(format);
// 		}
// 	} catch {
// 		// Ignore parsing errors
// 	}
// 	// Fallback: return as-is
// 	return value;
// };

// types.setTypeParser(DATE, (value) => {
// 	return parsePgDate(value, "yyyy-MM-dd");
// });

// types.setTypeParser(TIMESTAMP, (value) => {
// 	return parsePgDate(value, "yyyy-MM-dd'T'HH:mm:ss.SSS");
// });

// types.setTypeParser(TIMESTAMPTZ, (value) => {
// 	try {
// 		const dt = DateTime.fromISO(value);
// 		if (dt.isValid) {
// 			return dt.toUTC().toISO();
// 		}
// 	} catch {
// 		// Ignore
// 	}
// 	// Fallback: return as-is
// 	return value;
// });

export { DatabaseError, Pool };

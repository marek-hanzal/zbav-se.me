import { z } from "zod";

const DatabaseNameSchema = z
	.string()
	.min(1, "Database name is required")
	.max(63, "Database name is too long")
	.regex(/^[A-Za-z0-9_][A-Za-z0-9_-]*$/, "Database name contains invalid characters");

export namespace withDatabaseName {
	export interface Props {
		dsn: string;
		name: string;
	}
}

export const withDatabaseName = ({ dsn, name }: withDatabaseName.Props) => {
	const url = new URL(dsn);

	url.pathname = `/${DatabaseNameSchema.parse(name)}`;

	return url.toString();
};

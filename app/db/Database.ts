import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
	name: string;
	email: string;
	created: ColumnType<Date, string | undefined, never>;
}

export namespace UserTable {
	export type Select = Selectable<UserTable>;
	export type Create = Insertable<UserTable>;
	export type Update = Updateable<UserTable>;
}

export interface Database {
	user: UserTable;
}

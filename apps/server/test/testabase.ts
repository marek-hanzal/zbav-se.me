import { testabase as coolTestabase } from "@use-pico/server/testabase";
import { database } from "~/database/kysely";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: database,
		name,
	});
};

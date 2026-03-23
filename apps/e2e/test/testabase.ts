import { testabase as coolTestabase } from "@use-pico/server/testabase";
import { database } from "@zbav-se.me/server/database";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: database,
		name,
		onTestFinished(callbackFn) {
			//
		},
	});
};

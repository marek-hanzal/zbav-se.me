import { DateTime } from "luxon";
import type { ScheduleSchema } from "~/common/@cron/schema/ScheduleSchema";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";

export namespace runCronAtFx {
	export interface Props {
		now: string;
		schedule: ScheduleSchema.Type;
	}
}

export const runCronAtFx = ({ now, schedule }: runCronAtFx.Props) => {
	return withCronFx({
		schedule,
	}).pipe(
		withDateServiceFx({
			now: () =>
				DateTime.fromISO(now, {
					setZone: true,
				}),
		}),
	);
};

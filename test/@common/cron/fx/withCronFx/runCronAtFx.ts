import { DateTime } from "luxon";
import { withCronFx } from "~/cron/fx/withCronFx";
import type { ScheduleSchema } from "~/cron/schema/ScheduleSchema";
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

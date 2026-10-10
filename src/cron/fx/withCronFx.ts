import { Effect } from "effect";
import { withCron00Fx } from "~/cron/fx/withCron00Fx";
import { withCron04Fx } from "~/cron/fx/withCron04Fx";
import { withCron08Fx } from "~/cron/fx/withCron08Fx";
import { withCron12Fx } from "~/cron/fx/withCron12Fx";
import { withCron16Fx } from "~/cron/fx/withCron16Fx";
import { withCron20Fx } from "~/cron/fx/withCron20Fx";
import { withCronHourlyFx } from "~/cron/fx/withCronHourlyFx";
import { withCronMonthlyFx } from "~/cron/fx/withCronMonthlyFx";
import type { ScheduleSchema } from "~/cron/schema/ScheduleSchema";

const crons = {
	"00": withCron00Fx,
	"04": withCron04Fx,
	"08": withCron08Fx,
	"12": withCron12Fx,
	"16": withCron16Fx,
	"20": withCron20Fx,
	hourly: withCronHourlyFx,
	monthly: withCronMonthlyFx,
	noop: () => Effect.void,
} satisfies Record<ScheduleSchema.Type, () => Effect.Effect<any, never, unknown>>;

export namespace withCronFx {
	export interface Props {
		schedule: ScheduleSchema.Type;
	}
}

export const withCronFx = Effect.fn("withCronFx")(function* ({ schedule }: withCronFx.Props) {
	return yield* crons[schedule]();
});

export type withCronFx = ReturnType<typeof withCronFx>;

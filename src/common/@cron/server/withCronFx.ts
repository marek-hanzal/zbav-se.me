import { Effect } from "effect";
import type { ScheduleSchema } from "../schema/ScheduleSchema";
import { withCron00Fx } from "./schedule/withCron00Fx";
import { withCron04Fx } from "./schedule/withCron04Fx";
import { withCron08Fx } from "./schedule/withCron08Fx";
import { withCron12Fx } from "./schedule/withCron12Fx";
import { withCron16Fx } from "./schedule/withCron16Fx";
import { withCron20Fx } from "./schedule/withCron20Fx";
import { withCronHourlyFx } from "./schedule/withCronHourlyFx";
import { withCronMonthlyFx } from "./schedule/withCronMonthlyFx";

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

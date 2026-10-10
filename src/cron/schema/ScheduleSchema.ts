import { z } from "zod";

export const ScheduleSchema = z.enum([
	"00",
	"04",
	"08",
	"12",
	"16",
	"20",
	"hourly",
	"monthly",
	"noop",
]);

export type ScheduleSchema = typeof ScheduleSchema;

export namespace ScheduleSchema {
	export type Type = z.infer<ScheduleSchema>;
}

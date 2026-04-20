import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { routeFn } from "~/session/location/fn/routeFn";
import { RouteSchema } from "~/session/location/server/schema/RouteSchema";

const logger = getRootLogger([
	"tool",
	"toolRoute",
]);

export const toolRoute = tool({
	name: "route",
	needsApproval: false,
	description: `
Calculates route distance between two coordinates in meters.

Use when the user needs travel distance between two known points. Coordinates must be provided
as latitude and longitude. Prefer "drive" unless the user clearly asks for walking, cycling, or trucking.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(RouteSchema),
	async execute(data) {
		logger.trace("toolRoute", {
			data,
		});

		const distance = await routeFn({
			data,
		});

		return {
			distance,
			unit: "meters",
		};
	},
});

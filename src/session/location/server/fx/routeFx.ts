import { Effect } from "effect";
import { linkTo } from "@/lib/common/link-to";
import { getLoggerFx } from "@/lib/common/log";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { LocationContextFx } from "~/session/location/server/context/LocationContextFx";
import type { RouteSchema } from "~/session/location/server/schema/RouteSchema";

export namespace routeFx {
	export type Props = RouteSchema.Type;

	export interface MatrixEntry {
		distance: number;
		time: number;
		source_index: number;
		target_index: number;
	}

	export interface MatrixResponse {
		sources_to_targets: MatrixEntry[][];
	}
}

export const routeFx = Effect.fn("routeFx")(function* ({
	source,
	target,
	mode = "drive",
}: routeFx.Props) {
	const logger = yield* getLoggerFx("routeFx");
	logger.trace("routeFx", {
		source,
		target,
		mode,
	});

	const context = yield* LocationContextFx;

	const link = linkTo({
		base: context.api,
		href: context.route,
		query: {
			apiKey: context.geoapifyToken,
		},
	});

	const response = yield* Effect.promise(async () => {
		return fetch(link, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				mode,
				sources: [
					{
						location: [
							source.lon,
							source.lat,
						],
					},
				],
				targets: [
					{
						location: [
							target.lon,
							target.lat,
						],
					},
				],
				units: "metric",
			}),
		}).then((res) => {
			return res.json() as unknown as routeFx.MatrixResponse;
		});
	});

	const distance = response.sources_to_targets[0]?.[0]?.distance;

	if (typeof distance !== "number") {
		return yield* new InvalidRequestErrorFx({
			message: "Route distance could not be resolved",
		});
	}

	return distance;
});

export type routeFx = ReturnType<typeof routeFx>;

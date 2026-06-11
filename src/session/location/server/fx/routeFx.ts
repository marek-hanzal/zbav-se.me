import { Effect } from "effect";
import { linkTo } from "@/lib/common/link-to";
import { getLoggerFx } from "@/lib/common/log";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import type { RouteSchema } from "~/session/location/server/schema/RouteSchema";
import { LocationConfigFx } from "../context/LocationConfigFx";

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

	const locationConfig = yield* LocationConfigFx;

	const link = linkTo({
		base: locationConfig.api,
		href: locationConfig.route,
		query: {
			apiKey: locationConfig.geoapifyToken,
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

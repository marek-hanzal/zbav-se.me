import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { ModeEnumSchema } from "~/common/agent/enum/ModeEnumSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";

const logger = getRootLogger([
	"tool",
	"toolLocationAutocomplete",
]);

const InputSchema = z
	.looseObject({
		query: LocationAutocompleteSchema,
		mode: ModeEnumSchema,
	})
	.strip();

export const toolLocationAutocomplete = tool({
	name: "location-autocomplete",
	needsApproval: false,
	description: `
Location/address autocomplete for listing drafts, saved searches, and marketplace filters.

Use when the user gives a place name or address and you need normalized location candidates
or a location id. Return compact candidates; do not guess an id when multiple candidates are plausible.

Boundaries:
- Guess a "lang" from the user's language
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolLocationAutocomplete", {
			input,
		});

		const { query, mode } = await InputSchema.parseAsync(input);

		const matches = await locationAutocompleteFn({
			data: query,
		});

		return match(mode)
			.with("browse", () => {
				return {
					count: matches.length,
					matches: matches.map((item) => ({
						id: item.id,
						address: item.address,
						confidence: item.confidence,
						lat: item.lat,
						lon: item.lon,
					})),
				} as const;
			})
			.with("detail", () => {
				return {
					count: matches.length,
					matches: matches,
				} as const;
			})
			.exhaustive();
	},
});

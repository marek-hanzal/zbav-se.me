import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";

const logger = getRootLogger([
	"tool",
	"toolLocationAutocomplete",
]);

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
	parameters: unsafeJsonSchema(LocationAutocompleteSchema),
	async execute(data) {
		logger.trace("toolLocationAutocomplete", {
			data,
		});

		const matches = await locationAutocompleteFn({
			data,
		});

		return {
			count: matches.length,
			matches: matches,
		};
	},
});

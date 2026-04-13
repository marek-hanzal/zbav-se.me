import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";

const logger = getRootLogger([
	"tool",
	"toolLocationAutocomplete",
]);

export const toolLocationAutocomplete = tool({
	name: "location-autocomplete",
	needsApproval: false,
	description: "Location/address autocomplete. Return compact normalized candidates.",
	parameters: LocationAutocompleteSchema,
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

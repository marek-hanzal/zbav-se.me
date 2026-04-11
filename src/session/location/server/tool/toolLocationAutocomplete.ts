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
	description: `
        Tool for location (address, position) autocomplete, e.g. translating street into full address. This tool is
        able to translate even loose address (e.g. just a city name) if user wants so.
    `.trim(),
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
			matches,
		};
	},
});

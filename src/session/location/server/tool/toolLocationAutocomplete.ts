import { tool } from "@openai/agents";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";

export const toolLocationAutocomplete = tool({
	name: "location-autocomplete",
	needsApproval: false,
	description: `
        Tool for location (address, position) autocomplete, e.g. translating street into full address. This tool is
        able to translate even loose address (e.g. just a city name) if user wants so.
    `.trim(),
	parameters: LocationAutocompleteSchema,
	// outputSchema: z.array(LocationSchema),
	async execute(data) {
		return locationAutocompleteFn({
			data,
		});
	},
});

import { tool } from "ai";
import { z } from "zod";
import { locationAutocompleteFn } from "~/session/location/server/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const toolLocationAutocomplete = tool({
	title: "location-autocomplete",
	type: "function",
	needsApproval: false,
	description: `
        Tool for location (address, position) autocomplete, e.g. translating street into full address. This tool is
        able to translate even loose address (e.g. just a city name) if user wants so.
    `.trim(),
	inputSchema: LocationAutocompleteSchema,
	outputSchema: z.array(LocationSchema),
	async execute(data) {
		return locationAutocompleteFn({
			data,
		});
	},
});

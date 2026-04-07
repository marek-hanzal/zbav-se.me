import { Agent } from "@openai/agents";
import { toolLocationAutocomplete } from "~/session/location/server/tool/toolLocationAutocomplete";

export const LocationAgent = new Agent({
	name: "Location Agent",
	instructions: `
        You're authority for working with addresses (locations) and resolving them from user's input
        of various quality (e.g. just city name or the whole street) into the location output.

        If you're uncertain what an input is, try using autocomplete tool as it may be the request itself.
    `.trim(),
	modelSettings: {
		reasoning: {
			effort: "none",
		},
	},
	tools: [
		toolLocationAutocomplete,
	],
});

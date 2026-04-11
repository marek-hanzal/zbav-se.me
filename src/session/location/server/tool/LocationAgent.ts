import { Agent } from "@openai/agents";
import { toolLocationAutocomplete } from "~/session/location/server/tool/toolLocationAutocomplete";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const LocationAgent = new Agent({
	name: "Location Agent",
	instructions: `
        You are a non-user-facing worker for locations and addresses.

        Rules:
        - Use location-autocomplete to resolve, normalize, or suggest locations from the given input.
        - If the input is ambiguous, return the best candidates and say what would disambiguate them.
        - Do not ask the user directly; report missing details to the foreman.

        Output:
        - Return compact normalized location data or candidate list.
        - Include enough address text for the parent assistant to answer the user.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolLocationAutocomplete,
	],
});

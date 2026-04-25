import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";

const logger = getRootLogger([
	"tool",
	"toolLocationBrowse",
]);

const InputSchema = LocationAutocompleteSchema.omit({
	limit: true,
});

export const toolLocationBrowse = tool({
	name: "location-browse",
	needsApproval: false,
	description: `
Location/address autocomplete for listing drafts, saved searches, and marketplace filters.

Use when the user gives a place name or address and you need normalized location candidates
or a location id. Return compact candidates; do not guess an id when multiple candidates are plausible.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolLocationBrowse", {
			input,
		});

		const query = await InputSchema.parseAsync(input);

		const matches = await locationAutocompleteFn({
			data: {
				...query,
				limit: 3,
			},
		});

		if (!matches.length) {
			return "nothing";
		}

		return stringify(
			matches.map((item) => ({
				id: item.id,
				address: item.address,
				lat: item.lat,
				lon: item.lon,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"id",
					"address",
					"lat",
					"lon",
				],
			},
		);
	},
});

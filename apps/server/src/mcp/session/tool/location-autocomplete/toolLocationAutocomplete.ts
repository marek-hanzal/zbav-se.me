import { z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { LocationAutocompleteSchema } from "~/@session/location/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { LocationAutocompleteMcpSchema } from "~/mcp/session/schema/LocationAutocompleteMcpSchema";
import { LocationMcpOutputSchema } from "~/mcp/session/schema/LocationMcpOutputSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const LocationAutocompleteCollectionSchema = z
	.array(LocationMcpOutputSchema)
	.describe(
		"Array of structured location suggestions returned for the provided autocomplete or address normalization query.",
	);

type LocationAutocompleteCollectionSchema = typeof LocationAutocompleteCollectionSchema;

const examples: McpToolDefinition.Example<LocationAutocompleteMcpSchema.Type>[] = [
	{
		title: "Autocomplete a city in Czech",
		description:
			"Use this when the user is typing a city or municipality and expects localized suggestions.",
		arguments: {
			text: "Praha",
			lang: "cs",
		},
	},
	{
		title: "Normalize or translate an address into English",
		description:
			"Use this when you want a structured English-formatted address suggestion from free-form address text.",
		arguments: {
			text: "Václavské náměstí 1, Praha",
			lang: "en",
		},
	},
];

export const toolLocationAutocomplete: McpToolDefinition.Definition<
	LocationAutocompleteMcpSchema,
	LocationAutocompleteCollectionSchema
> = {
	name: "locationAutocomplete",
	namespace: "session",
	title: "Session Location Autocomplete",
	description:
		"Authenticated session tool for searching, autocompleting, normalizing, and language-targeting address or place text into structured location suggestions. Use this when you need coordinates, a formatted address, or a cleaned location record before a later marketplace action. Input text shorter than 3 characters returns an empty result set. See: zbav://mcp/guide/overview, zbav://mcp/guide/query-profiles, zbav://mcp/guide/failures, and zbav://mcp/entity/location.",
	role: "session",
	workflowHint:
		"Use before geo-aware listing search or whenever you need to normalize free-form location text into structured coordinates and address fields.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("query-profiles"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("session.location.autocomplete"),
		McpSchema.withProfileResourceUri("session.location.translateAddress"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("location"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("locationAutocomplete.text"),
		McpSchema.withFieldResourceUri("locationAutocomplete.lang"),
		McpSchema.withFieldResourceUri("location.query"),
		McpSchema.withFieldResourceUri("location.lang"),
		McpSchema.withFieldResourceUri("location.address"),
		McpSchema.withFieldResourceUri("location.city"),
		McpSchema.withFieldResourceUri("location.street"),
		McpSchema.withFieldResourceUri("location.zip"),
		McpSchema.withFieldResourceUri("location.country"),
		McpSchema.withFieldResourceUri("location.code"),
		McpSchema.withFieldResourceUri("location.confidence"),
		McpSchema.withFieldResourceUri("location.lat"),
		McpSchema.withFieldResourceUri("location.lon"),
	],
	annotations: {
		title: "Session Location Autocomplete",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: LocationAutocompleteMcpSchema.describe(
		"Session location autocomplete query. Accepts free-form address or place text together with a target language code.",
	),
	outputSchema: LocationAutocompleteCollectionSchema,
	examples,
	execute(args) {
		const query = LocationAutocompleteSchema.parse(args);
		const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

		return locationAutocompleteFx(query).pipe(
			withLocationFx({
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
			}),
			Effect.catchTag("TextTooShortErrorFx", () => Effect.succeed([])),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: z.array(LocationSchema),
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: LocationAutocompleteCollectionSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};

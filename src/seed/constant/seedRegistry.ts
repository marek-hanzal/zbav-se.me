import type { SeedDefinition } from "~/seed/type/SeedDefinition";

const listingsSeedDefinition: SeedDefinition.Type = {
	id: "listings",
	label: "Listings",
	defaultCount: 5000,
	defaultUserEmail: "b@x32.cz",
};

export const seedRegistry = [
	listingsSeedDefinition,
] as const satisfies readonly SeedDefinition.Type[];

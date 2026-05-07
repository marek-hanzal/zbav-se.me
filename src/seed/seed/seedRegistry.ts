import type { SeedDefinition } from "./SeedDefinition";

const listingsSeedDefinition: SeedDefinition.Type = {
	id: "listings",
	label: "Listings",
	defaultCount: 5000,
	defaultUserEmail: "seed-listings@test.cz",
};

export const seedRegistry = [
	listingsSeedDefinition,
] as const satisfies readonly SeedDefinition.Type[];

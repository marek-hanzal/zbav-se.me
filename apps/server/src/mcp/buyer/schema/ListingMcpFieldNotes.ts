export const ListingMcpFieldNotes = {
	my: "True when the listing belongs to the current authenticated user.",
	isFavourite: "True when the current authenticated user saved this listing to favourites.",
	isIgnored: "True when the current authenticated user chose to ignore this listing.",
	hasFlag: "True when the current authenticated user flagged this listing.",
	transactionId:
		"Transaction ID for the current authenticated user's related transaction, or null when no transaction exists.",
	thumb: "Current authenticated user's thumb reaction for this listing: like, dislike, or null.",
	distance:
		"Distance in kilometers from the query location to the listing, or null when no geo distance applies.",
	restriction:
		"Content restriction level of the listing. See zbav://mcp/schema/enum/listing-restriction.",
	priceType:
		"Price interpretation mode for the listing. See zbav://mcp/schema/enum/listing-price.",
	currency: "Currency code used by the listing price. See zbav://mcp/schema/enum/currency.",
	warranty: "Warranty status for the listing. See zbav://mcp/schema/enum/listing-warranty.",
	delivery:
		"Supported delivery methods for the listing. See zbav://mcp/schema/enum/listing-delivery.",
	createdAt: "Listing creation timestamp in ISO 8601 format.",
	updatedAt: "Listing last update timestamp in ISO 8601 format.",
	expiresAt: "Listing expiration timestamp in ISO 8601 format.",
} as const satisfies Record<string, string>;

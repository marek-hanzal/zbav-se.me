import { tool } from "@openai/agents";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import { FavouriteToggleSchema } from "~/buyer/favourite/server/schema/FavouriteToggleSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFavouriteRemove",
]);

export const toolFavouriteRemove = tool({
	name: "favourite-remove",
	needsApproval: false,
	description: `
Remove a listing from the current buyer user's favourites.

Use only when the user clearly wants to unfavourite/remove one listing. Requires a concrete listing identifier.
    `.trim(),
	parameters: FavouriteToggleSchema,
	async execute(data) {
		logger.trace("toolFavouriteRemove", {
			data,
		});

		return favouriteToggleFn({
			data: {
				...data,
				toggle: false,
			},
		});
	},
});

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
	description: "Remove a listing from the current user's favourites.",
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

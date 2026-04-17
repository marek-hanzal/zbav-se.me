import { tool } from "@openai/agents";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import { FavouriteToggleSchema } from "~/buyer/favourite/server/schema/FavouriteToggleSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFavouriteToggle",
]);

export const toolFavouriteToggle = tool({
	name: "favourite-toggle",
	needsApproval: false,
	description: `
Toggles concrete listing as favourite/unfavourite.
    `.trim(),
	parameters: FavouriteToggleSchema,
	async execute(data) {
		logger.trace("toolFavouriteToggle", {
			data,
		});

		return favouriteToggleFn({
			data,
		});
	},
});

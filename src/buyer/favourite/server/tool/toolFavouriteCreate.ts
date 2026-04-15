import { tool } from "@openai/agents";
import { favouriteCreateFn } from "~/buyer/favourite/fn/favouriteCreateFn";
import { FavouriteCreateSchema } from "~/buyer/favourite/server/schema/FavouriteCreateSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFavouriteCreate",
]);

export const toolFavouriteCreate = tool({
	name: "favourite-create",
	needsApproval: false,
	description: `
        Add a listing to the current buyer user's favourites.

        Use only when the user clearly wants to save or favourite one listing. Requires a concrete listing identifier and feed identifier.
    `.trim(),
	parameters: FavouriteCreateSchema,
	async execute(data) {
		logger.trace("toolFavouriteCreate", {
			data,
		});

		return favouriteCreateFn({
			data,
		});
	},
});

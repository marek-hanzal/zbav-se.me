import { tool } from "@openai/agents";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import { FavouriteToggleSchema } from "~/buyer/favourite/server/schema/FavouriteToggleSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

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
	strict: true,
	parameters: unsafeJsonSchema(FavouriteToggleSchema),
	async execute(input) {
		logger.trace("toolFavouriteToggle", {
			input,
		});

		const data = await FavouriteToggleSchema.parseAsync(input);

		return favouriteToggleFn({
			data,
		});
	},
});

import { tool } from "@openai/agents";
import { z } from "zod";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFavouriteToggle",
]);

const InputSchema = z
	.looseObject({
		toggle: z.boolean().meta({
			description: "Whether to add (true) or remove (false) the listing from favourites",
		}),
		feedId: z.string(),
		listingId: z.string(),
	})
	.strip();

export const toolFavouriteToggle = tool({
	name: "favourite-toggle",
	needsApproval: false,
	description: `
Toggles concrete listing as favourite/unfavourite.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFavouriteToggle", {
			input,
		});

		const data = await InputSchema.parseAsync(input);

		await favouriteToggleFn({
			data,
		});

		return "ok";
	},
});

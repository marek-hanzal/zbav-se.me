import { tool } from "@openai/agents";
import { draftCreateFn } from "~/seller/draft/server/fn/draftCreateFn";
import { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";

export const toolDraftCreate = tool({
	name: "draft-create",
	needsApproval: false,
	description: `
        When a user asks for new listing creation, it starts from Draft which is WIP listing
        before publication.

        Here you've basically all the fields optional, but you've to validate draft before publishing
        the listing.

        You should ask user for fields required if you don't already know answers (e.g. I'm selling a TV, you
        can guess title and category).
    `.trim(),
	parameters: DraftCreateSchema,
	// outputSchema: DraftSchema,
	async execute(data) {
		return draftCreateFn({
			data,
		});
	},
});

import { tool } from "@openai/agents";
import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { draftPatchFn } from "~/seller/draft/fn/draftPatchFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftPatch",
]);

const InputSchema = z
	.looseObject({
		draftId: z.string().min(1),
		patch: z
			.looseObject({
				price: z.coerce.number().optional().meta({
					description: "Price of the draft",
					type: "number",
				}),
				priceType: ListingPriceEnumSchema.optional().meta({
					description: "Price type of the draft",
				}),
				condition: z.number().optional().meta({
					description: "Condition of the item (0-based index)",
				}),
				age: z.number().optional().meta({
					description: "Age of the item (0-based index)",
				}),
				delivery: z.array(ListingDeliveryEnumSchema).nullish().meta({
					description: "Delivery methods for the draft",
				}),
				warranty: ListingWarrantyEnumSchema.nullish().meta({
					description: "Warranty type for the draft",
				}),
				restriction: RestrictionEnumSchema.nullish().meta({
					description: "Content restriction level of the draft",
				}),
				locationId: z.string().optional().meta({
					description: "ID of the location",
				}),
				categoryId: z.string().optional().meta({
					description: "ID of the category",
				}),
				expiresAt: ListingExpireEnumSchema.optional(),
				title: TitleSchema.optional(),
				description: DescriptionSchema.nullish(),
				pros: ProsConsSchema.nullish().meta({
					description: "Pros of the item",
				}),
				cons: ProsConsSchema.nullish().meta({
					description: "Cons of the item",
				}),
				uploadIds: z.array(z.string()).optional().meta({
					description:
						"IDs of the uploads; order of uploads defines order in the gallery",
				}),
			})
			.strip(),
	})
	.strip();

export const toolDraftPatch = tool({
	name: "draft-patch",
	needsApproval: false,
	description: `
Patch one existing saved listing draft.

Hints:
- You can update only fields you want to change, unset (remove) unwanted fields by sending explicit 'null'.

Price type:
- closed: Fixed price.
- open: Open/negotiable price.

Delivery:
- personal
- post
- package
- other

Warranty:
- warranty
- no-warranty
- custom

Restriction:
> See restriction system
- Overrides restriction from category (so you need to know restriction on category)
- Only same or higher restriction can be used (e.g. category: adult, 'adult', 'sensitive' and 'restricted' are possible)

Expiration:
If not provided by user, use '14-days' as a default
- 7-days
- 14-days
- 1-month.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolDraftPatch", {
			input,
		});

		const { draftId: id, patch } = await InputSchema.parseAsync(input);

		await draftPatchFn({
			data: {
				patch,
				query: {
					where: {
						id,
					},
				},
			},
		});

		return "ok";
	},
});

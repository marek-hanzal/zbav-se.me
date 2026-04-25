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
import { draftCreateFn } from "~/seller/draft/fn/draftCreateFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftCreate",
]);

const InputSchema = z.looseObject({
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
	title: TitleSchema,
	description: DescriptionSchema.nullish(),
	pros: ProsConsSchema.nullish().meta({
		description: "Pros of the item",
	}),
	cons: ProsConsSchema.nullish().meta({
		description: "Cons of the item",
	}),
	uploadIds: z.array(z.string()).optional().meta({
		description: "IDs of the uploads; order of uploads defines order in the gallery",
	}),
});

export const toolDraftCreate = tool({
	name: "draft-create",
	needsApproval: false,
	description: `
Create a saved listing draft for the current seller from known fields.

Hints:
- The title is only required, if not provided by user, you may invent yours based on context
- Everything else is optional
- You may create 'feed' with title only and than continually patch it as user prompts

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
		logger.trace("toolDraftCreate", {
			input,
		});

		const data = await InputSchema.parseAsync(input);

		const { id } = await draftCreateFn({
			data,
		});

		return `draftId ${id}`;
	},
});

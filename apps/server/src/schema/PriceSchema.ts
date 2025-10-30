import z from "zod";

export const PriceSchema = ({
	type = "Price",
	description = "Generic price, for filters, items, whatever.",
}: PriceSchema.Props) =>
	z.number().gte(0).openapi(type, {
		description,
	});

export type PriceSchema = ReturnType<typeof PriceSchema>;

export namespace PriceSchema {
	export interface Props {
		type?: string;
		description?: string;
	}

	export type Type = z.infer<PriceSchema>;
}

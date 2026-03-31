import { z } from "zod";

export const PriceSchema = ({
	id = "Price",
	description = "Generic price, for filters, items, whatever.",
}: PriceSchema.Props) =>
	z.number().gte(0).meta({
		id,
		description,
	});

export type PriceSchema = ReturnType<typeof PriceSchema>;

export namespace PriceSchema {
	export interface Props {
		id?: string;
		description?: string;
	}

	export type Type = z.infer<PriceSchema>;
}

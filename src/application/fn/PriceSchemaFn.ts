import { z } from "zod";

export const PriceSchemaFn = ({
	id = "Price",
	description = "Generic price, for filters, items, whatever.",
}: PriceSchemaFn.Props) =>
	z.number().gte(0).meta({
		id,
		description,
	});

export type PriceSchemaFn = ReturnType<typeof PriceSchemaFn>;

export namespace PriceSchemaFn {
	export interface Props {
		id?: string;
		description?: string;
	}

	export type Type = z.infer<PriceSchemaFn>;
}

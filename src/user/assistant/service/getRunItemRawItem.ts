import { match, P } from "ts-pattern";

export namespace getRunItemRawItem {
	export interface Props {
		item: unknown;
	}
}

export const getRunItemRawItem = ({ item }: getRunItemRawItem.Props): unknown => {
	return match(item)
		.with(
			{
				rawItem: P.any,
			},
			(item) => item.rawItem,
		)
		.with(
			{
				toJSON: P.instanceOf(Function),
			},
			(item) => {
				const serialized = item.toJSON();

				return match(serialized)
					.with(
						{
							rawItem: P.any,
						},
						(serialized) => serialized.rawItem,
					)
					.otherwise(() => undefined);
			},
		)
		.otherwise(() => undefined);
};

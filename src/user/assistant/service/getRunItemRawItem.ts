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
			({ rawItem }) => rawItem,
		)
		.otherwise(() => undefined);
};

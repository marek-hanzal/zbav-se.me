import { match, P } from "ts-pattern";

export namespace getToolSearchCallId {
	export interface Props {
		item: unknown;
		index: number;
	}
}

export const getToolSearchCallId = ({ item, index }: getToolSearchCallId.Props): string => {
	return match(item)
		.with(
			{
				callId: P.string,
			},
			(item) => item.callId,
		)
		.with(
			{
				call_id: P.string,
			},
			(item) => item.call_id,
		)
		.with(
			{
				id: P.string,
			},
			(item) => item.id,
		)
		.otherwise(() => `tool-search-${index}`);
};

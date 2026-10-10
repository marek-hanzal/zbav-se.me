import type { FC } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { PriceTypeSelect } from "~/price-type/ui/PriceTypeSelect/index";
import { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";

export namespace PriceTypePatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancelFn(): void;
		onSettledFn?(): void;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({
	feed,
	onSettledFn,
	onCancelFn,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.where?.priceTypeIn ?? []).map((priceType) => ({
			id: priceType,
		})),
		deps: [
			feed,
		],
	});

	return (
		<Container
			data-ui={"PriceTypePatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<PriceTypeSelect selection={selection} />

			<SaveContainer
				onCancelFn={onCancelFn}
				onSaveFn={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								where: {
									...feed.query?.where,
									priceTypeIn:
										selection.optional.multiIdFn() as PriceTypeEnumSchema.Type[],
								},
							},
						},
					});
				}}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};

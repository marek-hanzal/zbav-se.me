import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { PriceTypeSelect } from "~/common/price-type/ui/PriceTypeSelect";

export namespace PriceTypePatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.priceTypeIn ?? []).map((priceType) => ({
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
				onCancel={onCancel}
				onSave={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								filter: {
									...feed.query?.filter,
									priceTypeIn:
										selection.optional.multiId() as PriceTypeEnumSchema.Type[],
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

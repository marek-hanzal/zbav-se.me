import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { DeliverySelect } from "~/common/delivery/ui/DeliverySelect";

export namespace DeliveryPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.where?.deliveryIn ?? []).map((delivery) => ({
			id: delivery,
		})),
		deps: [
			feed,
		],
	});

	return (
		<Container
			data-ui={"DeliveryPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<DeliverySelect selection={selection} />

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
								where: {
									...feed.query?.where,
									deliveryIn:
										selection.optional.multiId() as DeliveryEnumSchema.Type[],
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

import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed, tListingDeliveryEnum } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { DeliverySelect } from "~/app/@common/delivery/ui/DeliverySelect";

export namespace DeliveryPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({ feed, onSettled, ...props }) => {
	const patchMutation = withFeedQuery.useMutation();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.deliveryIn ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	return (
		<PatchContainer
			data-ui={"DeliveryPatch[Container]"}
			onSave={() => {
				patchMutation.mutate(
					{
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
									deliveryIn:
										selection.optional.multiId() as tListingDeliveryEnum[],
								},
							},
						},
					},
					{
						onSettled,
					},
				);
			}}
			loading={patchMutation.isPending}
			disabled={false}
			{...props}
		>
			<DeliverySelect selection={selection} />
		</PatchContainer>
	);
};

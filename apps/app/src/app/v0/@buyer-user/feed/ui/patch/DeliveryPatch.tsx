import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed, tListingDeliveryEnum } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { DeliverySelect } from "~/app/@common/delivery/ui/DeliverySelect";

export namespace DeliveryPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	ui,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.deliveryIn ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	return (
		<Container
			data-ui={"DeliveryPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				inner: "default",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<DeliverySelect selection={selection} />

			<SaveContainer
				onCancel={onCancel}
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
			/>
		</Container>
	);
};

import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed, tListingDeliveryEnum } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { SaveControl } from "~/app/control/SaveControl";
import { DeliverySelect } from "~/app/delivery/ui/DeliverySelect";

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
	const patch = withFeedFetchQuery.useSet();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.deliveryIn ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	const mutation = withFeedPatchMutation.useMutation({
		onSuccess(feed) {
			patch(() => feed, {
				where: {
					id: feed.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<Container
			data-ui={"DeliveryPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				inner: "default",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<DeliverySelect selection={selection} />

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					mutation.mutate({
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
						query: {
							where: {
								id: feed.id,
							},
						},
					});
				}}
				loading={mutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};

import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { tListingDeliveryEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
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
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.deliveryIn ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	return (
		<PatchContainer
			data-ui={"DeliveryPatch[Container]"}
			ui={ui}
			onCancel={onCancel}
			onSave={() => {
				patch({
					query: {
						...feed.query,
						filter: {
							...feed.query?.filter,
							deliveryIn: selection.optional.multiId() as tListingDeliveryEnum[],
						},
					},
				});
			}}
			loading={isPending}
			disabled={false}
			{...props}
		>
			<DeliverySelect selection={selection} />
		</PatchContainer>
	);
};

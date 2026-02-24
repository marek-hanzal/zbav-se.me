import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingDeliveryEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { DeliverySelect } from "~/app/@common/delivery/ui/DeliverySelect";

export namespace DeliveryPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const mutation = withDraftQuery.useMutation({
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (draft.delivery ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	const deliveryIds = selection.optional.multiId();
	const delivery = deliveryIds.length > 0 ? (deliveryIds as tListingDeliveryEnum[]) : null;

	return (
		<PatchContainer
			title={translator.text("Delivery (title)")}
			data-ui={"Setup-[TitleContainer.delivery]"}
			onCancel={onCancel}
			onSave={() => {
				mutation.mutate({
					patch: {
						delivery,
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
			disabled={false}
			{...props}
		>
			<DeliverySelect selection={selection} />
		</PatchContainer>
	);
};

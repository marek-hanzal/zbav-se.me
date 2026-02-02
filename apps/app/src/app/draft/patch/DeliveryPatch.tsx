import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft, tListingDeliveryEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { DeliverySelect } from "~/app/delivery/ui/DeliverySelect";

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
	const patch = withDraftFetchQuery.useSet();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (draft.delivery ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	const deliveryIds = selection.optional.multiId();
	const delivery = deliveryIds.length > 0 ? (deliveryIds as tListingDeliveryEnum[]) : null;

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(draft) {
			patch(() => draft, {
				where: {
					id: draft.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.delivery]"}
			textTitle={"Delivery (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
			>
				<DeliverySelect selection={selection} />

				<SaveContainer
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
				/>
			</Container>
		</TitleContainer>
	);
};

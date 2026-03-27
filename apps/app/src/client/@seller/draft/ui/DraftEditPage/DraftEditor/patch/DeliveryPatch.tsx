import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { DeliverySelect } from "~/client/@common/delivery/ui/DeliverySelect";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace DeliveryPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("warranty");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (draft.delivery ?? []).map((delivery) => ({
			id: delivery,
		})),
	});

	const deliveryIds = selection.optional.multiId();
	const delivery =
		deliveryIds.length > 0 ? (deliveryIds as ListingDeliveryEnumSchema.Type[]) : null;

	return (
		<TitleContainer
			textTitle={translator.text("Delivery (title)")}
			data-ui={"Setup-[TitleContainer.delivery]"}
			left={<EditAction />}
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
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};

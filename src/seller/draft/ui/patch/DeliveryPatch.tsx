import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { DeliverySelect } from "~/common/delivery/ui/DeliverySelect";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export namespace DeliveryPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"description">;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.set("description");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: draft.delivery.map((delivery) => ({
			id: delivery,
		})),
		deps: [
			draft,
		],
	});

	const deliveryIds = selection.optional.multiId() as DeliveryEnumSchema.Type[];

	return (
		<TitleContainer
			data-ui={"DeliveryPatch"}
			textTitle={translator.text("Delivery (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<DeliverySelect selection={selection} />

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								delivery: deliveryIds,
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

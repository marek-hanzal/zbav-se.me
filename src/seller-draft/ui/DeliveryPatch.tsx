import type { FC } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { DeliverySelect } from "~/delivery/ui/DeliverySelect";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { useSelection } from "~/selection/hook/useSelection";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

export namespace DeliveryPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"description">;
	}
}

export const DeliveryPatch: FC<DeliveryPatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const translator = useTranslator();
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

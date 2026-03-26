import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/seller";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { WarrantySelect } from "~/client/@common/warranty/ui/WarrantySelect";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace WarrantyPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("condition");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: draft.warranty
			? [
					{
						id: draft.warranty,
					},
				]
			: [],
	});

	const warrantyId = selection.optional.singleId();
	const warranty = (warrantyId as tListingWarrantyEnum) ?? null;

	return (
		<TitleContainer
			textTitle={translator.text("Warranty (title)")}
			data-ui={"Setup-[TitleContainer.warranty]"}
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
				<WarrantySelect selection={selection} />

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								warranty,
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

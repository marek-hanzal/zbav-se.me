import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingWarrantyEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/v0/@common/container/ui/PatchContainer";
import { WarrantySelect } from "~/app/v0/@common/warranty/ui/WarrantySelect";

export namespace WarrantyPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
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
		<PatchContainer
			title={translator.text("Warranty (title)")}
			data-ui={"Setup-[TitleContainer.warranty]"}
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
			{...props}
		>
			<WarrantySelect selection={selection} />
		</PatchContainer>
	);
};

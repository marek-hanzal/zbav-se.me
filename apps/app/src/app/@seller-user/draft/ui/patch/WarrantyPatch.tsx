import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingWarrantyEnum } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { WarrantySelect } from "~/app/@common/warranty/ui/WarrantySelect";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

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
	const { patch, isPending } = useDraftPatch({
		draft,
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
			onSave={() =>
				patch({
					warranty,
				})
			}
			loading={isPending}
			disabled={false}
			{...props}
		>
			<WarrantySelect selection={selection} />
		</PatchContainer>
	);
};

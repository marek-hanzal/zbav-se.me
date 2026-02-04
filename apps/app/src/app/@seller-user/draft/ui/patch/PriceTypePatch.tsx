import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft, tListingPriceEnum } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { PriceTypeSelect } from "~/app/@common/price-type/ui/PriceTypeSelect";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

export namespace PriceTypePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({
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
		initial: draft.priceType
			? [
					{
						id: draft.priceType,
					},
				]
			: [],
	});

	const priceTypeId = selection.optional.singleId();
	const priceType = (priceTypeId as tListingPriceEnum) ?? null;

	return (
		<PatchContainer
			title="Price type (title)"
			data-ui={"Setup-[TitleContainer.priceType]"}
			onCancel={onCancel}
			onSave={() =>
				patch({
					priceType,
				})
			}
			loading={isPending}
			disabled={priceType === null}
			{...props}
		>
			<PriceTypeSelect selection={selection} />
		</PatchContainer>
	);
};

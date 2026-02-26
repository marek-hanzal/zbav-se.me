import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingPriceEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/v0/@common/container/ui/PatchContainer";
import { PriceTypeSelect } from "~/app/v0/@common/price-type/ui/PriceTypeSelect";

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
	const mutation = withDraftQuery.usePatchMutation({
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
			title={translator.text("Price type (title)")}
			data-ui={"Setup-[TitleContainer.price-type]"}
			onCancel={onCancel}
			onSave={() => {
				mutation.mutate({
					patch: {
						priceType,
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
			disabled={priceType === null}
			{...props}
		>
			<PriceTypeSelect selection={selection} />
		</PatchContainer>
	);
};

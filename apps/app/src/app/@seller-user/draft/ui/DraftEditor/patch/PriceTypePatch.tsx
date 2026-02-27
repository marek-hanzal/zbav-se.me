import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingPriceEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { PriceTypeSelect } from "~/app/@common/price-type/ui/PriceTypeSelect";
import { EditAction } from "~/app/@seller-user/draft/ui/DraftEditor/EditAction";

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
		<TitleContainer
			textTitle={translator.text("Price type (title)")}
			data-ui={"Setup-[TitleContainer.price-type]"}
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
				<PriceTypeSelect selection={selection} />

				<SaveContainer
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
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};

import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft, tListingPriceEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveControl } from "~/app/@common/control/SaveControl";
import { PriceTypeSelect } from "~/app/@common/price-type/ui/PriceTypeSelect";

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
	const patch = withDraftFetchQuery.useSet();
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
			data-ui={"Setup-[TitleContainer.priceType]"}
			textTitle={"Price type (title)"}
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

				<SaveControl
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
					disabled={!priceType}
				/>
			</Container>
		</TitleContainer>
	);
};

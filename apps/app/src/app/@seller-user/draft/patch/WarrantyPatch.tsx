import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft, tListingWarrantyEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveControl } from "~/app/@common/control/SaveControl";
import { WarrantySelect } from "~/app/@common/warranty/ui/WarrantySelect";

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
	const patch = withDraftFetchQuery.useSet();
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
			data-ui={"Setup-[TitleContainer.warranty]"}
			textTitle={"Warranty (title)"}
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

				<SaveControl
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
				/>
			</Container>
		</TitleContainer>
	);
};

import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingRestrictionEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { RestrictionSelect } from "~/app/@common/restriction/ui/RestrictionSelect";

export namespace RestrictionPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const RestrictionPatch: FC<RestrictionPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const mutation = withDraftQuery.useMutation({
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: draft.restriction
			? [
					{
						id: draft.restriction,
					},
				]
			: [],
	});

	const restrictionId = selection.optional.singleId();
	const restriction: tListingRestrictionEnum | null =
		(restrictionId as tListingRestrictionEnum | undefined) ?? null;

	return (
		<PatchContainer
			title={translator.text("Listing restriction (title)")}
			data-ui={"Setup-[TitleContainer.restriction]"}
			onCancel={onCancel}
			onSave={() => {
				if (restriction === null) {
					return;
				}

				mutation.mutate({
					patch: {
						restriction,
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
			disabled={restriction === null}
			{...props}
		>
			<RestrictionSelect selection={selection} />
		</PatchContainer>
	);
};

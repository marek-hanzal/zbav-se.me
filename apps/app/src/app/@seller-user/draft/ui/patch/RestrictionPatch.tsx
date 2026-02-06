import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft, tListingRestrictionEnum } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { RestrictionSelect } from "~/app/@common/restriction/ui/RestrictionSelect";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

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
	const { patch, isPending } = useDraftPatch({
		draft,
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
			title="Listing restriction (title)"
			data-ui={"Setup-[TitleContainer.restriction]"}
			onCancel={onCancel}
			onSave={() => {
				if (restriction === null) {
					return;
				}

				patch({
					restriction,
				});
			}}
			loading={isPending}
			disabled={restriction === null}
			{...props}
		>
			<RestrictionSelect selection={selection} />
		</PatchContainer>
	);
};

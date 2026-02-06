import { useSelection } from "@use-pico/client/hook";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/@common/age/ui/AgeSelection";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

export namespace AgePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const { patch, isPending } = useDraftPatch({
		draft,
		onSettled,
	});
	const selection = useSelection<Rating.RatingItem>({
		mode: "single",
		initial: draft.age
			? [
					{
						id: String(draft.age),
					},
				]
			: [],
	});

	const itemId = selection.optional.singleId();
	const age = itemId ? Number.parseInt(itemId, 10) : null;

	return (
		<PatchContainer
			title="Age (title)"
			data-ui={"Setup-[TitleContainer.age]"}
			onCancel={onCancel}
			onSave={() =>
				patch({
					age,
				})
			}
			loading={isPending}
			disabled={age === null}
			{...props}
		>
			<AgeSelection selection={selection} />
		</PatchContainer>
	);
};

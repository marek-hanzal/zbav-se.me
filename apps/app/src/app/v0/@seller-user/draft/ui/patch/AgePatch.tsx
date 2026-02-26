import { useSelection } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/v0/@common/age/ui/AgeSelection";
import { PatchContainer } from "~/app/v0/@common/container/ui/PatchContainer";

export namespace AgePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const mutation = withDraftQuery.useMutation({
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
			title={translator.text("Age (title)")}
			data-ui={"Setup-[TitleContainer.age]"}
			onCancel={onCancel}
			onSave={() => {
				mutation.mutate({
					patch: {
						age,
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
			disabled={age === null}
			{...props}
		>
			<AgeSelection selection={selection} />
		</PatchContainer>
	);
};

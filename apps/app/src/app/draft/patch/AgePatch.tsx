import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/@common/age/ui/AgeSelection";
import { SaveControl } from "~/app/control/SaveControl";

export namespace AgePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const patch = withDraftFetchQuery.useSet();
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
			data-ui={"Setup-[TitleContainer.age]"}
			textTitle={"Age (title)"}
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
				<AgeSelection selection={selection} />

				<SaveControl
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
					disabled={!age}
				/>
			</Container>
		</TitleContainer>
	);
};

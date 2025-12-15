import { useQueryClient } from "@tanstack/react-query";
import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { ConditionSelect } from "~/app/condition/ui/ConditionSelect";
import { SaveControl } from "~/app/control/SaveControl";

export namespace ConditionPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const queryClient = useQueryClient();
	const selection = useSelection<Rating.RatingItem>({
		mode: "single",
		initial:
			draft.condition !== null && draft.condition !== undefined
				? [
						{
							id: String(draft.condition),
						},
					]
				: [],
	});

	const itemId = selection.optional.singleId();
	const condition = itemId ? Number.parseInt(itemId, 10) : null;

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess() {
			withDraftFetchQuery.invalidate(queryClient, {
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
			data-ui={"Setup-[TitleContainer.condition]"}
			textTitle={"Condition (title)"}
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
				<ConditionSelect selection={selection} />

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								condition,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={!condition}
				/>
			</Container>
		</TitleContainer>
	);
};

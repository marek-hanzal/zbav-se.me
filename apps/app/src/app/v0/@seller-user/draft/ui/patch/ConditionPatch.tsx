import { useSelection } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { Container } from "@use-pico/client/ui/container";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { ConditionSelect } from "~/app/v0/@common/condition/ui/ConditionSelect";

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
	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
	});
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

	return (
		<TitleContainer
			textTitle={translator.text("Condition (title)")}
			data-ui={"Setup-[TitleContainer.condition]"}
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

				<SaveContainer
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
					disabled={condition === null}
				/>
			</Container>
		</TitleContainer>
	);
};

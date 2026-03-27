import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { ConditionSelect } from "~/client/@common/condition/ui/ConditionSelect";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/client/@seller/draft/server/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace ConditionPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("age");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<Rating.RatingItem>({
		mode: "single",
		initial: draft.condition
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
					disabled={false}
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};

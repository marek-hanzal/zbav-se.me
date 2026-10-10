import type { FC } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import type { Rating } from "~/application-ui/ui/rating.exports";
import { ConditionSelect } from "~/condition/ui/ConditionSelect";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useSelection } from "~/selection/hook/useSelection";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

export namespace ConditionPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"age">;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("age");
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
		deps: [
			draft,
		],
	});

	const itemId = selection.optional.singleIdFn();
	const condition = itemId ? Number.parseInt(itemId, 10) : null;

	return (
		<TitleContainer
			data-ui={"ConditionPatch"}
			textTitle={translator.textFn("Condition (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<ConditionSelect selection={selection} />

				<SaveContainer
					onCancelFn={onCancelFn}
					onSaveFn={() => {
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

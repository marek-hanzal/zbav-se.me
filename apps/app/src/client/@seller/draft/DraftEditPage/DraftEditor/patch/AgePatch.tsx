import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/client/@common/age/ui/AgeSelection";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace AgePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("default");
		},
		invalidate: [
			"collection",
		],
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
		<TitleContainer
			textTitle={translator.text("Age (title)")}
			data-ui={"Setup-[TitleContainer.age]"}
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
				<AgeSelection selection={selection} />

				<SaveContainer
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

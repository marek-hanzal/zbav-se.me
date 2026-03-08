import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { CategorySelect } from "~/app/@session/category/ui/CategorySelect/CategorySelect";
import type { Data } from "../Data";
import { EditAction } from "../EditAction";

export namespace CategoryPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: Data.View): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("condition");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: draft.categoryId
			? [
					{
						id: draft.categoryId,
					},
				]
			: [],
	});

	const categoryId = selection.optional.singleId();

	return (
		<TitleContainer
			textTitle={translator.text("Listing category (title)")}
			data-ui={"Setup-[TitleContainer.category]"}
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
				<CategorySelect
					selection={selection}
					categoryId={categoryId}
				/>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								categoryId,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={!categoryId}
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

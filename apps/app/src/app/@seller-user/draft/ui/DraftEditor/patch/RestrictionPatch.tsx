import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingRestrictionEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { RestrictionSelect } from "~/app/@common/restriction/ui/RestrictionSelect";
import { EditAction } from "~/app/@seller-user/draft/ui/DraftEditor/EditAction";

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
	const mutation = withDraftQuery.usePatchMutation({
		invalidate: [
			"collection",
		],
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
		<TitleContainer
			textTitle={translator.text("Listing restriction (title)")}
			data-ui={"Setup-[TitleContainer.restriction]"}
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
				<RestrictionSelect selection={selection} />

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						if (restriction === null) {
							return;
						}

						mutation.mutate({
							patch: {
								restriction,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={restriction === null}
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};

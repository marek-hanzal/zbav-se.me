import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { LocationSelectContainer } from "~/app/@common/location/ui/LocationSelectContainer";

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const mutation = withDraftQuery.useMutation({
		onSettled,
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.location]"}
			textTitle={translator.text("Location (title)")}
			{...props}
		>
			<LocationSelectContainer
				textHint={translator.text("Location security (hint)")}
				onCancel={onCancel}
				onSave={({ locationId }) => {
					mutation.mutate({
						patch: {
							locationId,
						},
						query: {
							where: {
								id: draft.id,
							},
						},
					});
				}}
				loading={mutation.isPending}
				value={draft.locationId}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};

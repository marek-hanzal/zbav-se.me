import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { LocationControl } from "~/app/location/ui/LocationControl";

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
	const patch = withDraftFetchQuery.useSet();
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
			data-ui={"Setup-[TitleContainer.location]"}
			textTitle={"Location (title)"}
			{...props}
		>
			<LocationControl
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

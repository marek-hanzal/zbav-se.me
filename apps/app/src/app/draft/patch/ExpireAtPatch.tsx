import { Container } from "@use-pico/client/ui/container";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";
import { ExpireAtSelect } from "~/app/expire-at/ui/ExpireAtSelect";

export namespace ExpireAtPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const ExpireAtPatch: FC<ExpireAtPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const patch = withDraftFetchQuery.useSet();
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(
		draft.expiresAt as tListingExpireEnum,
	);

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
			data-ui={"Setup-[TitleContainer.expireAt]"}
			textTitle={"Expire (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
				}}
			>
				<ExpireAtSelect
					value={expiresAt}
					onChange={setExpiresAt}
				/>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						if (expiresAt) {
							mutation.mutate({
								patch: {
									expiresAt,
								},
								query: {
									where: {
										id: draft.id,
									},
								},
							});
						}
					}}
					loading={mutation.isPending}
					disabled={!expiresAt}
				/>
			</Container>
		</TitleContainer>
	);
};

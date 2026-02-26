import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { PatchContainer } from "~/app/v0/@common/container/ui/PatchContainer";
import { ExpireAtSelect } from "~/app/v0/@common/expire-at/ui/ExpireAtSelect";

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
	const mutation = withDraftQuery.useMutation({
		onSettled,
	});
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(
		draft.expiresAt as tListingExpireEnum,
	);

	return (
		<PatchContainer
			title={translator.text("Expire (title)")}
			data-ui={"Setup-[TitleContainer.expire-at]"}
			onCancel={onCancel}
			onSave={() => {
				if (!expiresAt) {
					return;
				}

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
			}}
			loading={mutation.isPending}
			disabled={!expiresAt}
			{...props}
		>
			<ExpireAtSelect
				value={expiresAt}
				onChange={setExpiresAt}
			/>
		</PatchContainer>
	);
};

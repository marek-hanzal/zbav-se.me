import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { ExpireAtSelect } from "~/app/@common/expire-at/ui/ExpireAtSelect";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";

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
	const { patch, isPending } = useDraftPatch({
		draft,
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
			onSave={() =>
				expiresAt &&
				patch({
					expiresAt,
				})
			}
			loading={isPending}
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

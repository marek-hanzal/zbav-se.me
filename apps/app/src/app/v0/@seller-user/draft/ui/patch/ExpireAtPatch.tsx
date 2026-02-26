import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { Container } from "@use-pico/client/ui/container";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
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
	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
	});
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(
		draft.expiresAt as tListingExpireEnum,
	);

	return (
		<TitleContainer
			textTitle={translator.text("Expire (title)")}
			data-ui={"Setup-[TitleContainer.expire-at]"}
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
				<ExpireAtSelect
					value={expiresAt}
					onChange={setExpiresAt}
				/>

				<SaveContainer
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
				/>
			</Container>
		</TitleContainer>
	);
};

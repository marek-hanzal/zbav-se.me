import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { ExpireAtSelect } from "~/app/@common/expire-at/ui/ExpireAtSelect";
import { EditAction } from "../EditAction";

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
		invalidate: [
			"collection",
		],
	});
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(
		draft.expiresAt as tListingExpireEnum,
	);

	return (
		<TitleContainer
			textTitle={translator.text("Expire (title)")}
			data-ui={"Setup-[TitleContainer.expire-at]"}
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

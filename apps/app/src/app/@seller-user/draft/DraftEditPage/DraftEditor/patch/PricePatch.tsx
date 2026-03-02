import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Dial } from "@zbav-se.me/ui/dial";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { EditAction } from "~/app/@seller-user/draft/ui/DraftEditor/EditAction";

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const [price, setPrice] = useState<string | undefined>(
		draft.price ? String(draft.price) : undefined,
	);
	const mutation = withDraftQuery.usePatchMutation({
		onSettled() {
			onSettled?.();
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.price]"}
			textTitle={translator.text("Price (title)")}
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
				<Dial
					value={price}
					onChange={setPrice}
					placeholder={translator.text("Price (placeholder)")}
					ui={{
						inner: "default",
					}}
				/>

				<SaveContainer
					onCancel={() => {
						onCancel();
						setPrice(draft.price ? String(draft.price) : undefined);
					}}
					onSave={() => {
						mutation.mutate({
							patch: {
								price: price ? parseFloat(price) : null,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={!price}
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};

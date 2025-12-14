import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Dial } from "@zbav-se.me/ui/dial";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(price: number | null): void;
		loading: boolean;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const [price, setPrice] = useState<string | undefined>(
		draft.price ? String(draft.price) : undefined,
	);

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.price]"}
			textTitle={"Price (title)"}
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
				/>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(price ? parseFloat(price) : null);
					}}
					loading={loading}
					disabled={!price}
				/>
			</Container>
		</TitleContainer>
	);
};

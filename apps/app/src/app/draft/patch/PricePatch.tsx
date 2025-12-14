import { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
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
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Price (title)"}
						action={
							<Dial
								value={price}
								onChange={setPrice}
							/>
						}
					>
						<Mx
							label={"Price (required)"}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Status>
				</Container>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(price ? parseFloat(price) : null);
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};

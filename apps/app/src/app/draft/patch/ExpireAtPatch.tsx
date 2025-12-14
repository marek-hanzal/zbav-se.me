import { Container } from "@use-pico/client/ui/container";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";
import { ExpireAtSelect } from "~/app/expire-at/ui/ExpireAtSelect";

export namespace ExpireAtPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(expiresAt: tListingExpireEnum): void;
		loading: boolean;
	}
}

export const ExpireAtPatch: FC<ExpireAtPatch.Props> = ({
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(undefined);

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
							onSave(expiresAt);
						}
					}}
					loading={loading}
					disabled={!expiresAt}
				/>
			</Container>
		</TitleContainer>
	);
};

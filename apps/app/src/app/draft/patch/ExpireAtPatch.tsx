import { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { DateTime } from "luxon";
import { type FC, useState } from "react";
import { match } from "ts-pattern";
import { SaveControl } from "~/app/control/SaveControl";
import { ExpireAtContainer } from "~/app/expire-at/ui/ExpireAtContainer";

export namespace ExpireAtPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(expiresAt: string): void;
		loading: boolean;
	}
}

const parseExpiresAt = (expiresAt: string): tListingExpireEnum | undefined => {
	if (!expiresAt) return undefined;

	const now = DateTime.now();
	const expireDate = DateTime.fromISO(expiresAt);

	const daysDiff = expireDate.diff(now, "days").days;

	if (Math.abs(daysDiff - 7) < 1) {
		return "7-days";
	}
	if (Math.abs(daysDiff - 14) < 1) {
		return "14-days";
	}
	if (Math.abs(daysDiff - 30) < 1) {
		return "1-month";
	}

	return undefined;
};

const expiresAtToDate = (expiresAt: tListingExpireEnum): string => {
	return match(expiresAt)
		.with(
			"7-days",
			() =>
				DateTime.now()
					.plus({
						days: 7,
					})
					.toISO() ?? "",
		)
		.with(
			"14-days",
			() =>
				DateTime.now()
					.plus({
						days: 14,
					})
					.toISO() ?? "",
		)
		.with(
			"1-month",
			() =>
				DateTime.now()
					.plus({
						months: 1,
					})
					.toISO() ?? "",
		)
		.exhaustive();
};

export const ExpireAtPatch: FC<ExpireAtPatch.Props> = ({
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(
		parseExpiresAt(draft.expiresAt),
	);

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
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Expire (title)"}
						action={
							<ExpireAtContainer
								value={expiresAt}
								onChange={setExpiresAt}
							/>
						}
					>
						<Mx
							label={"Expire (required)"}
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
						if (expiresAt) {
							onSave(expiresAtToDate(expiresAt));
						}
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};

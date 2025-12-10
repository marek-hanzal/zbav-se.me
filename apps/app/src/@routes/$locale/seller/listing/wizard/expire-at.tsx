import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tListingExpireEnum } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ExpireAtContainer } from "~/app/expire-at/ui/ExpireAtContainer";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { uiBackButton } from "~/app/ui/uiBackButton";

export const Route = createFileRoute("/$locale/seller/listing/wizard/expire-at")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [expiresAt, setExpiresAt] = useState<tListingExpireEnum | undefined>(state.expiresAt);

		return (
			<TitleContainer
				data-ui="ExpireAt-root"
				textTitle={"Expire (title)"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/location"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						ui={{
							tone: "secondary",
						}}
						iconProps={{
							ui: {
								size: "md",
							},
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick: () => {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/title"}
						params={{
							locale,
						}}
						search={{
							...state,
							expiresAt,
						}}
						disabled={!expiresAt}
					>
						<Button
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - title (button)"}
							disabled={!expiresAt}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "lg",
							}}
						/>
					</LinkTo>
				}
			>
				<ExpireAtContainer
					value={expiresAt}
					onChange={setExpiresAt}
				/>
			</TitleContainer>
		);
	},
});

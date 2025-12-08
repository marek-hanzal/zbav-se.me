import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { asButton } from "@use-pico/theme/button";
import type { tListingExpireEnum } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ExpireAtContainer } from "~/app/expire-at/ui/ExpireAtContainer";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

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
						{...asButton({
							round: "full",
							square: "default",
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
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
						confirmProps={{
							tone: "danger",
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
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							iconPosition={"right"}
							label={"Next - title (button)"}
							disabled={!expiresAt}
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

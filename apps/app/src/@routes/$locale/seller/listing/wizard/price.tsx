import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton, uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Dial } from "@zbav-se.me/ui/dial";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/seller/listing/wizard/price")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [price, setPrice] = useState(state.price);

		return (
			<TitleContainer
				data-ui="Price-root"
				textTitle={"Price (title)"}
				textSubtitle={
					price
						? price === "0"
							? "Price - free (title)"
							: toLocaleNumber({
									number: parseFloat(price),
									locale,
									currency: countryToCurrency[locale as countryToCurrency.Key],
									style: "currency",
									trailingZeroDisplay: "stripIfInteger",
								})
						: "Price (subtitle)"
				}
				left={
					<LinkTo
						{...uiButton({
							ui: {
								round: "full",
								square: "default",
								opacity: "subtle",
							},
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/age"}
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
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/location"}
						params={{
							locale,
						}}
						search={{
							...state,
							price,
						}}
						disabled={!price}
					>
						<Button
							iconEnabled={ArrowRightIcon}
							disabled={!price}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "lg",
							}}
							iconPosition={"right"}
							label={"Next - location (button)"}
						/>
					</LinkTo>
				}
			>
				<Dial
					value={price}
					onChange={setPrice}
				/>
			</TitleContainer>
		);
	},
});

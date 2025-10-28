import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
} from "@use-pico/client";
import { toHumanNumber } from "@use-pico/common";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { Dial } from "~/app/ui/dial/Dial";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/listing/wizard/price")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [price, setPrice] = useState(state.price);

		return (
			<ListingContainer
				textTitle={"Price (title)"}
				textSubtitle={
					price
						? price === "0"
							? "Price - free (title)"
							: toHumanNumber({
									number: parseFloat(price),
									locale,
									currency:
										countryToCurrency[
											locale as countryToCurrency.Key
										],
									style: "currency",
									trailingZeroDisplay: "stripIfInteger",
								})
						: "Price (subtitle)"
				}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/age"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/location"}
						params={{
							locale,
						}}
						search={{
							...state,
							price,
						}}
						disabled={!price}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							disabled={!price}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - location (button)"}
						/>
					</LinkTo>
				}
			>
				<Container square={"xl"}>
					<Dial
						value={price}
						onChange={setPrice}
					/>
				</Container>
			</ListingContainer>
		);
	},
});

import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, LinkTo } from "@use-pico/client";
import { toHumanNumber } from "@use-pico/common";
import { CurrencyList } from "@zbav-se.me/common";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { Dial } from "~/app/ui/dial/Dial";

export const Route = createFileRoute("/$locale/listing/wizard/price")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const state = Route.useSearch();

		return (
			<ListingContainer
				textTitle={"Price (title)"}
				textSubtitle={
					state.price
						? toHumanNumber({
								number: parseFloat(state.price),
								locale,
								currency: state.currency,
								style: "currency",
								trailingZeroDisplay: "stripIfInteger",
							})
						: "Price (subtitle)"
				}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/category"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<Dial
					locale={locale}
					value={state.price}
					onChange={(price) => {
						navigate({
							search(prev) {
								return {
									...prev,
									price,
								};
							},
						});
					}}
					onChangeCurrency={(currency) => {
						navigate({
							search(prev) {
								return {
									...prev,
									currency: currency as CurrencyList.Type,
								};
							},
						});
					}}
					defaultCurrency={state.currency}
					availableCurrencies={CurrencyList}
				/>
			</ListingContainer>
		);
	},
});

import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ErrorIcon,
	LinkTo,
	PriceInline,
	SpinnerIcon,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { apiListingCreateBody } from "@zbav-se.me/sdk";
import { withCategoryFetchQuery } from "~/app/category/query/withCategoryFetchQuery";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/ListingContainer";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/listing/wizard/submit")({
	validateSearch: ListingWizardSchema,
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<ListingContainer
				textTitle={"Submit (title)"}
				textSubtitle={"Submit (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/expire-at"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<Status icon={SpinnerIcon} />
			</ListingContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const { data: category } = withCategoryFetchQuery().useSuspenseQuery(
			{
				where: {
					id: state.categoryId,
				},
			},
			{
				enabled: !!state.categoryId,
			},
		);
		const { data: location } = withLocationFetchQuery().useSuspenseQuery({
			where: {
				id: state.locationId,
			},
		});
		const valid = apiListingCreateBody.safeParse({
			...state,
			currency: countryToCurrency[locale as countryToCurrency.Key],
			price: state.price ? parseFloat(state.price) : undefined,
		});

		return (
			<ListingContainer
				textTitle={"Submit (title)"}
				textSubtitle={"Submit (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/expire-at"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				{valid.success ? (
					<div>
						<div className={"grid grid-auto-rows gap-2"}>
							<div>
								<LinkTo
									to={"/$locale/listing/wizard/photos"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing photos (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<Typo label={valid.data.uploadIds.length} />
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/category"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing category (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<div className={"flex flex-col gap-1"}>
									<Typo
										label={category.group}
										size={"sm"}
									/>
									<Typo label={category.category} />
								</div>
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/condition"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing condition (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<Tx
									label={`Condition - Overall [${valid.data.condition}] (hint)`}
								/>
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/age"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing age (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<Tx
									label={`Condition - Age [${valid.data.age}] (hint)`}
								/>
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/price"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing price (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<PriceInline
									price={valid.data.price}
									currency={valid.data.currency}
								/>
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/location"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing location (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<Typo label={location.address} />
							</div>

							<div>
								<LinkTo
									to={"/$locale/listing/wizard/expire-at"}
									params={{
										locale,
									}}
									search={state}
									display={"block"}
								>
									<Tx
										label={"Listing expire at (label)"}
										preset={"label"}
									/>
								</LinkTo>

								<Tx label={`Expire in ${state.expiresAt}`} />
							</div>
						</div>
					</div>
				) : (
					<Status
						icon={ErrorIcon}
						textTitle={"Invalid/missing fields"}
					/>
				)}
			</ListingContainer>
		);
	},
});

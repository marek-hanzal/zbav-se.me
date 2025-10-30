import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Badge,
	type BadgeCls,
	Button,
	Container,
	ErrorIcon,
	LinkTo,
	PriceInline,
	SpinnerIcon,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { type Cls, VariantProvider } from "@use-pico/cls";
import { zListingCreate } from "@zbav-se.me/sdk";
import { SendPackageIcon, ThemeCls, TitleContainer } from "@zbav-se.me/ui";
import { withCategoryFetchQuery } from "~/app/category/query/withCategoryFetchQuery";
import { withListingCreateMutation } from "~/app/listing/mutation/withListingCreateMutation";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/seller/listing/wizard/submit")({
	validateSearch: ListingWizardSchema,
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<TitleContainer
				textTitle={"Submit (title)"}
				textSubtitle={"Submit (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/vendor-model"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<Status icon={SpinnerIcon} />
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
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
		const createListingMutation = withListingCreateMutation.useMutation({
			async onPostMutation({ result }) {
				return navigate({
					to: "/$locale/seller/listing/$id/view",
					params: {
						id: result.id,
					},
				});
			},
		});
		const valid = zListingCreate.safeParse({
			...state,
			currency: countryToCurrency[locale as countryToCurrency.Key],
			price: state.price ? parseFloat(state.price) : undefined,
		});

		const badgeTweak: Cls.TweaksOf<BadgeCls> = {
			slot: {
				root: {
					class: [
						"flex",
						"flex-row",
						"gap-1",
						"justify-between",
						"w-full",
						"h-fit",
					],
					token: [
						"round.md",
						"square.md",
					],
				},
			},
		};

		return (
			<TitleContainer
				textTitle={"Submit (title)"}
				textSubtitle={"Submit (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/vendor-model"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<Button
						iconEnabled={SendPackageIcon}
						label={"Submit listing (button)"}
						disabled={
							createListingMutation.isPending || !valid.success
						}
						loading={createListingMutation.isPending}
						tone={"primary"}
						theme={"dark"}
						size={"lg"}
						full
						onClick={() => {
							valid.success &&
								createListingMutation.mutate(valid.data);
						}}
					/>
				}
			>
				{valid.success ? (
					<Container
						layout={"vertical-flex"}
						scroll={"vertical"}
						gap={"md"}
						height={"fit"}
						width={"fit"}
					>
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: "light",
							}}
						>
							<LinkTo
								to={"/$locale/seller/listing/wizard/photos"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing photos (label)"}
										preset={"label"}
									/>

									<Typo label={valid.data.uploadIds.length} />
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/category"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing category (label)"}
										preset={"label"}
									/>

									<div
										className={
											"flex flex-col gap-1 items-end"
										}
									>
										<Typo
											label={category.group}
											size={"sm"}
										/>
										<Typo label={category.category} />
									</div>
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/condition"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing condition (label)"}
										preset={"label"}
									/>

									<Tx
										label={`Condition - Overall [${valid.data.condition}] (hint)`}
									/>
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/age"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing age (label)"}
										preset={"label"}
									/>

									<Tx
										label={`Condition - Age [${valid.data.age}] (hint)`}
									/>
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/price"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing price (label)"}
										preset={"label"}
									/>

									<PriceInline
										price={valid.data.price}
										currency={valid.data.currency}
									/>
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/location"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge
									tweak={{
										slot: {
											root: {
												class: [
													"flex",
													"flex-col",
													"items-start",
													"h-fit",
													"w-full",
												],
												token: [
													"round.md",
													"square.md",
												],
											},
										},
									}}
								>
									<Tx
										label={"Listing location (label)"}
										preset={"label"}
									/>

									<Typo
										label={location.address}
										wrap={"wrap"}
									/>
								</Badge>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/expire-at"}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing expire at (label)"}
										preset={"label"}
									/>

									<Tx
										label={`Expire in ${state.expiresAt}`}
									/>
								</Badge>
							</LinkTo>

							<LinkTo
								to={
									"/$locale/seller/listing/wizard/vendor-model"
								}
								params={{
									locale,
								}}
								search={state}
								display={"block"}
								full
							>
								<Badge tweak={badgeTweak}>
									<Tx
										label={"Listing vendor & model (label)"}
										preset={"label"}
									/>

									<div
										className={
											"flex flex-col gap-1 items-end"
										}
									>
										<Tx
											label={
												state.vendor
													? state.vendor
													: "Vendor (placeholder)"
											}
											size={"sm"}
										/>
										<Tx
											label={
												state.model
													? state.model
													: "Model (placeholder)"
											}
										/>
									</div>
								</Badge>
							</LinkTo>
						</VariantProvider>
					</Container>
				) : (
					<Status
						icon={ErrorIcon}
						textTitle={"Invalid/missing fields"}
					/>
				)}
			</TitleContainer>
		);
	},
});

import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CloseIcon,
	ErrorIcon,
	SpinnerIcon,
} from "@use-pico/client/icon";
import { Badge, type BadgeCls, BadgeValue } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { type Cls, VariantProvider } from "@use-pico/cls";
import { zListingCreate } from "@zbav-se.me/sdk";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
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
		const navigate = Route.useNavigate();

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
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
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
			>
				<Status icon={SpinnerIcon} />
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const categoryFetchQuery = withCategoryFetchQuery.useSuspenseQuery(
			{
				where: {
					id: state.categoryId,
				},
			},
			{
				enabled: !!state.categoryId,
			},
		);
		const locationFetchQuery = withLocationFetchQuery.useSuspenseQuery({
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
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
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
								<BadgeValue
									textLabel={"Listing photos (label)"}
									textValue={String(
										valid.data.uploadIds.length,
									)}
								/>
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
											label={
												categoryFetchQuery.data.group
											}
											size={"sm"}
										/>
										<Typo
											label={
												categoryFetchQuery.data.category
											}
										/>
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
								<BadgeValue
									textLabel={"Listing condition (label)"}
									textValue={`Condition - Overall [${valid.data.condition}] (hint)`}
								/>
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
								<BadgeValue
									textLabel={"Listing age (label)"}
									textValue={`Condition - Age [${valid.data.age}] (hint)`}
								/>
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
										locale={locale}
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
								<BadgeValue
									textLabel={"Listing location (label)"}
									textValue={locationFetchQuery.data.address}
								/>
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
								<BadgeValue
									textLabel={"Listing expire at (label)"}
									textValue={`Expire in ${state.expiresAt}`}
								/>
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

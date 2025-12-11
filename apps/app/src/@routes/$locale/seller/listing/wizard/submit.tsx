import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CloseIcon,
	EditIcon,
	ErrorIcon,
	Icon,
	SpinnerIcon,
} from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { zListingCreate } from "@zbav-se.me/sdk/api/user";
import { withListingCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { CategoryValueList } from "~/app/category/ui/CategoryValueList";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { LocationBadgeValue } from "~/app/location/ui/LocationBadgeValue";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/seller/listing/wizard/submit")({
	validateSearch: ListingWizardSchema,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				data-ui={"Submit"}
				textTitle={"Submit (title)"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/title"}
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
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick() {
								navigate({
									to: "/$locale/ui/seller",
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

		return (
			<TitleContainer
				textTitle={"Submit (title)"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/title"}
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
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick() {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<Button
						iconEnabled={SendPackageIcon}
						label={"Submit listing (button)"}
						disabled={createListingMutation.isPending || !valid.success}
						loading={createListingMutation.isPending}
						onClick={() => {
							valid.success && createListingMutation.mutate(valid.data);
						}}
						ui={{
							tone: "primary",
							theme: "dark",
							size: "lg",
						}}
					/>
				}
			>
				{valid.success ? (
					<Container
						ui={{
							layout: "vertical-flex",
							scroll: "vertical",
							gap: "md",
							height: "full",
							width: "full",
						}}
					>
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: "light",
							}}
						>
							<LinkTo
								to={"/$locale/seller/listing/wizard/title"}
								params={{
									locale,
								}}
								search={state}
							>
								<BadgeValue
									textLabel={"Listing title (label)"}
									textValue={state.title}
									action={<Icon icon={EditIcon} />}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/photos"}
								params={{
									locale,
								}}
								search={state}
							>
								<BadgeValue
									textLabel={"Listing photos (label)"}
									textValue={String(valid.data.uploadIds.length)}
									action={<Icon icon={EditIcon} />}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/category"}
								params={{
									locale,
								}}
								search={state}
							>
								<CategoryValueList
									categoryIdIn={
										state.categoryId
											? [
													state.categoryId,
												]
											: undefined
									}
									textTitle={"Listing category (label)"}
									textEmpty={"no"}
									action={<Icon icon={EditIcon} />}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/condition"}
								params={{
									locale,
								}}
								search={state}
							>
								<ContainerValueList
									textTitle={"Listing condition (label)"}
									textEmpty={"no"}
									action={<Icon icon={EditIcon} />}
									items={[
										{
											id: "condition",
											value: valid.data.condition,
										} as const,
									]}
									renderFn={(condition) => (
										<Tx
											label={`Condition - Overall [${condition.value}] (hint)`}
										/>
									)}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/age"}
								params={{
									locale,
								}}
								search={state}
							>
								<ContainerValueList
									textTitle={"Listing age (label)"}
									textEmpty={"no"}
									action={<Icon icon={EditIcon} />}
									items={[
										{
											id: "age",
											value: valid.data.age,
										} as const,
									]}
									renderFn={(age) => (
										<Tx label={`Condition - Age [${age.value}] (hint)`} />
									)}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/price"}
								params={{
									locale,
								}}
								search={state}
							>
								<BadgeValue
									textLabel={"Listing price (label)"}
									textValue={
										<PriceInline
											locale={locale}
											price={valid.data.price}
											currency={valid.data.currency}
										/>
									}
									action={<Icon icon={EditIcon} />}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/location"}
								params={{
									locale,
								}}
								search={state}
							>
								<LocationBadgeValue
									locationId={state.locationId}
									textLabel={"Listing location (label)"}
									textValue={"no"}
									action={<Icon icon={EditIcon} />}
								/>
							</LinkTo>

							<LinkTo
								to={"/$locale/seller/listing/wizard/expire-at"}
								params={{
									locale,
								}}
								search={state}
							>
								<ContainerValueList
									textTitle={"Listing expire at (label)"}
									textEmpty={"no"}
									action={<Icon icon={EditIcon} />}
									items={[
										{
											id: "expiresAt",
											value: state.expiresAt,
										} as const,
									]}
									renderFn={(expiresAt) => (
										<Tx label={`Expire in ${expiresAt.value}`} />
									)}
								/>
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

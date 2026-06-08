import type { FC } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon, Icon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { CloseButton } from "~/common/ui/button";
import { CheckIcon } from "~/common/ui/icon";
import { withBundleActiveQuery } from "~/user/resource-bundle/query/withBundleActiveQuery";
import type { BundleSchema } from "~/user/stripe/server/schema/BundleSchema";
import { CheckoutButton } from "./CheckoutButton";

export namespace BundleItem {
	export interface Props extends Container.Props {
		bundle: BundleSchema.Type;
	}
}

const fallbackDescription = (bundle: BundleSchema.Type) => {
	switch (bundle.bundle) {
		case "package:buyer":
			return "Méně šumu pro nakupování: feedy, early discovery kupóny a tokeny na rozšíření.";
		case "package:seller":
			return "Nástroje pro prodej: více inzerátů, fotky, zvýraznění, data a brand.";
		case "package:pro":
			return "Kupující i prodejce v jednom: nejvíc limitů, passů a pohodlí bez cirkusu.";
		case "package:master":
			return "Nejvyšší balíček pro podporu projektu a maximum dostupných nástrojů.";
		default:
			return "Předplatné pro pohodlnější používání Zbav-se.me.";
	}
};

const resourceLabel = (resource: string) => {
	switch (resource) {
		case "common:item:token":
			return "Tokeny";
		case "common:item:agent.usage":
			return "Použití asistenta";
		case "common:item:support":
			return "Support";
		case "common:feature:founder":
			return "Founders";
		case "buyer:limit:feed.count":
			return "Uložené feedy";
		case "seller:limit:listing.count":
			return "Aktivní inzeráty";
		case "seller:limit:listing.gallery.count":
			return "Fotky u inzerátu";
		case "buyer:feature:listing.early-discovery":
			return "Early Discovery";
		case "buyer:feature:seller.info":
			return "Detail prodejce";
		case "buyer:feature:anti-topper":
			return "Anti-topper";
		case "buyer:feature:history":
			return "Historie trhu";
		case "seller:feature:buyer.info":
			return "Detail kupujícího";
		case "seller:feature:brand":
			return "Brand";
		case "seller:feature:listing.info":
			return "Rozšířená data";
		case "seller:feature:listing.longer-expiration":
			return "Delší expirace";
		case "seller:feature:payback":
			return "Payback";
		case "seller:feature:listing.early-delivery":
			return "Early Delivery";
		case "seller:item:listing.early-delivery":
			return "Early Delivery kupón";
		case "seller:item:listing.mark":
			return "Mark kupón";
		case "seller:item:listing.top":
			return "Top kupón";
		case "seller:item:listing.top-maxxi":
			return "Top Maxxi kupón";
		default:
			return resource;
	}
};

export const BundleItem: FC<BundleItem.Props> = ({ bundle, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);
	const { data: isActive } = withBundleActiveQuery.useSuspenseQuery({
		bundle: bundle.bundle,
	});
	const stripeDescription = bundle.description?.trim() || "";
	const description = stripeDescription.startsWith("bundle=")
		? fallbackDescription(bundle)
		: stripeDescription || fallbackDescription(bundle);
	const price = (
		<PriceInline
			price={bundle.price / 100}
			locale={locale}
			currency={bundle.currency.toUpperCase()}
		/>
	);

	return (
		<Container
			{...props}
			data-ui={"BundleItem"}
			data-resource-bundle={bundle.bundle}
			data-ui-bundle={bundle.bundle}
		>
			<Button
				data-ui={"BundleItem-[CardButton]"}
				data-resource-bundle={bundle.bundle}
				data-ui-bundle={bundle.bundle}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-width="full"
				data-ui-height="content"
				data-ui-background="default"
				data-ui-border={true}
				data-ui-shadow={true}
				data-ui-round="xl"
				data-ui-inner="default"
				data-ui-flow="vertical"
				data-ui-items="stretch"
				data-ui-gap="default"
				onClick={() => {
					setIsOpen(true);
				}}
			>
				<Container
					data-ui-layout="horizontal"
					data-ui-items="start"
					data-ui-justify="space-between"
					data-ui-gap="default"
					data-ui-width="full"
				>
					<Container
						data-ui-layout="vertical"
						data-ui-gap="xs"
					>
						<Typo
							label={bundle.name}
							preset="subheader"
						/>
						<Typo
							label={description}
							data-ui-opacity="7"
							data-ui-text="sm"
						/>
					</Container>

					<Icon
						icon={ChevronRightIcon}
						data-ui-text="xl"
					/>
				</Container>

				<Container
					data-ui-layout="horizontal"
					data-ui-items="center"
					data-ui-justify="space-between"
					data-ui-gap="default"
					data-ui-width="full"
				>
					<Typo
						label={price}
						data-ui-font="bold"
					/>
					{isActive ? (
						<Typo
							label={translator.text("Active", "Active")}
							data-ui={"BundleItem-[Active]"}
							data-ui-color="lead"
							data-ui-font="bold"
						/>
					) : null}
				</Container>
			</Button>

			<BottomSheet
				data-ui="BundleItem-[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent="default"
				withHeader
				header={({ close }) => ({
					title: bundle.name,
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					data-ui="BundleItem-[SheetContent]"
					data-ui-layout="vertical"
					data-ui-gap="default"
					data-ui-inner="default"
					data-ui-scroll="vertical"
				>
					<LabelValue
						textLabel={translator.text("Price (label)", "Cena")}
						textValue={price}
					/>

					<LabelValue
						textLabel={translator.text("Description (label)", "Popis")}
						textValue={description}
					/>

					<ValueList
						data-ui={"BundleItem-[Items]"}
						textLabel={translator.text("Bundle items (label)", "Items")}
						textEmpty={translator.text("Bundle items empty", "No items")}
						items={bundle.items}
						renderFn={(item) => (
							<Typo
								label={`${item.amount}× ${resourceLabel(item.resourceDefinitionId)}`}
							/>
						)}
					/>

					<ValueList
						data-ui={"BundleItem-[Limits]"}
						textLabel={translator.text("Bundle limits (label)", "Limits")}
						textEmpty={translator.text("Bundle limits empty", "No limits")}
						items={bundle.limits}
						renderFn={(limit) => (
							<Typo
								label={`${limit.limit} ${resourceLabel(limit.resourceDefinitionId)}`}
							/>
						)}
					/>

					<ValueList
						data-ui={"BundleItem-[Features]"}
						textLabel={translator.text("Bundle features (label)", "Features")}
						textEmpty={translator.text("Bundle features empty", "No features")}
						items={bundle.features}
						renderFn={(feature) => (
							<Typo label={resourceLabel(feature.resourceDefinitionId)} />
						)}
					/>

					{isActive ? (
						<Container
							data-ui="BundleItem-[ActiveNotice]"
							data-ui-layout="horizontal"
							data-ui-items="center"
							data-ui-gap="sm"
							data-ui-inner="default"
							data-ui-background="default"
							data-ui-round="default"
						>
							<Icon
								icon={CheckIcon}
								data-ui-text="xl"
							/>
							<Typo
								label={translator.text(
									"Subscription active (message)",
									"Tohle předplatné teď běží. Zrušení zastaví další obnovu, aktuální období doběhne.",
								)}
								data-ui-text="sm"
							/>
						</Container>
					) : null}

					<CheckoutButton
						bundle={bundle.bundle}
						isActive={isActive}
					/>
				</Container>
			</BottomSheet>
		</Container>
	);
};

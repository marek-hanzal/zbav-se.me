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

const isHumanStripeDescription = (description: string) => {
	return description.length > 0 && !description.startsWith("bundle=");
};

export const BundleItem: FC<BundleItem.Props> = ({ bundle, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);
	const { data: isActive } = withBundleActiveQuery.useSuspenseQuery({
		bundle: bundle.bundle,
	});
	const stripeDescription = bundle.description?.trim() || "";
	const description = isHumanStripeDescription(stripeDescription)
		? stripeDescription
		: translator.text(`Resource bundle - ${bundle.bundle} (description)`);
	const price = (
		<PriceInline
			price={bundle.price / 100}
			locale={locale}
			currency={bundle.currency.toUpperCase()}
		/>
	);
	const resourceLabel = (resourceDefinitionId: string) => {
		return translator.text(`Resource definition - ${resourceDefinitionId} (label)`);
	};

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
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="space-between"
				data-ui-gap="default"
				iconEnabled={ChevronRightIcon}
				iconPosition="right"
				iconProps={{
					"data-ui-text": "xl",
				}}
				onClick={() => {
					setIsOpen(true);
				}}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="sm"
					data-ui-width="full"
					className="min-w-0 flex-1 text-left"
				>
					<Container
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-justify="space-between"
						data-ui-gap="default"
						data-ui-width="full"
					>
						<Typo
							label={bundle.name}
							preset="subheader"
							data-ui-truncate
							className="min-w-0"
						/>
						<Typo
							label={price}
							data-ui-font="bold"
							className="shrink-0 whitespace-nowrap"
						/>
					</Container>

					<Typo
						label={description}
						data-ui-opacity="7"
						data-ui-text="sm"
						data-ui-wrap="wrap"
					/>

					{isActive ? (
						<Typo
							label={translator.text("Active")}
							data-ui={"BundleItem-[Active]"}
							data-ui-color="lead"
							data-ui-font="bold"
							data-ui-text="sm"
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
				contentProps={{
					className: "h-full min-h-0 overflow-hidden",
				}}
				header={({ close }) => ({
					title: bundle.name,
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					data-ui="BundleItem-[SheetContent]"
					data-ui-layout="vertical-flex"
					data-ui-gap="default"
					data-ui-inner="default"
					data-ui-height="full"
					data-ui-scroll="vertical"
					className="pb-6"
				>
					<LabelValue
						textLabel="Price (label)"
						textValue={price}
					/>

					<LabelValue
						textLabel="Description (label)"
						textValue={<Typo label={description} />}
					/>

					<ValueList
						data-ui={"BundleItem-[Items]"}
						textLabel="Bundle items (label)"
						textEmpty="Bundle items empty"
						items={bundle.items}
						renderFn={(item) => (
							<Typo
								label={`${item.amount}× ${resourceLabel(item.resourceDefinitionId)}`}
							/>
						)}
					/>

					<ValueList
						data-ui={"BundleItem-[Limits]"}
						textLabel="Bundle limits (label)"
						textEmpty="Bundle limits empty"
						items={bundle.limits}
						renderFn={(limit) => (
							<Typo
								label={`${limit.limit} ${resourceLabel(limit.resourceDefinitionId)}`}
							/>
						)}
					/>

					<ValueList
						data-ui={"BundleItem-[Features]"}
						textLabel="Bundle features (label)"
						textEmpty="Bundle features empty"
						items={bundle.features}
						renderFn={(feature) => (
							<Typo label={resourceLabel(feature.resourceDefinitionId)} />
						)}
					/>

					{isActive ? (
						<Container
							data-ui="BundleItem-[ActiveNotice]"
							data-ui-layout="horizontal-flex"
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
								label={translator.text("Subscription active (message)")}
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

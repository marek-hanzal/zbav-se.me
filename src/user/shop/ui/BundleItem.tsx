import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { ValueList } from "@/lib/client/value";
import { withBundleActiveQuery } from "~/user/resource-bundle/query/withBundleActiveQuery";
import type { BundleSchema } from "~/user/stripe/server/schema/BundleSchema";
import { CheckoutButton } from "./CheckoutButton";

export namespace BundleItem {
	export interface Props extends Container.Props {
		bundle: BundleSchema.Type;
	}
}

export const BundleItem: FC<BundleItem.Props> = ({ bundle, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { data: isActive } = withBundleActiveQuery.useSuspenseQuery({
		bundle: bundle.bundle,
	});

	return (
		<Container
			{...props}
			data-ui={"BundleItem"}
			data-resource-bundle={bundle.bundle}
			data-ui-bundle={bundle.bundle}
			data-ui-layout="vertical"
			data-ui-gap="md"
		>
			<Container
				data-ui={"BundleItem-[Header]"}
				data-ui-layout="horizontal"
				data-ui-gap="default"
				data-ui-items="center"
				data-ui-justify="space-between"
			>
				<Container
					data-ui={"BundleItem-[Title]"}
					data-ui-layout="vertical"
					data-ui-gap="xs"
				>
					<Typo
						label={bundle.name}
						preset="subheader"
					/>

					<Typo
						label={
							<PriceInline
								price={bundle.price / 100}
								locale={locale}
								currency="CZK"
							/>
						}
						data-ui-opacity="7"
					/>
				</Container>

				{isActive ? (
					<Typo
						label={translator.text("Active", "Active")}
						data-ui={"BundleItem-[Active]"}
						data-ui-color="lead"
						data-ui-font="bold"
					/>
				) : null}
			</Container>

			<Container
				data-ui={"BundleItem-[Details]"}
				data-ui-layout="vertical"
				data-ui-gap="sm"
			>
				<ValueList
					data-ui={"BundleItem-[Items]"}
					textLabel={translator.text("Bundle items (label)", "Items")}
					textEmpty={translator.text("Bundle items empty", "No items")}
					items={bundle.items}
					renderFn={(item) => (
						<Typo label={`${item.amount}x ${item.resourceDefinitionId}`} />
					)}
				/>

				<ValueList
					data-ui={"BundleItem-[Limits]"}
					textLabel={translator.text("Bundle limits (label)", "Limits")}
					textEmpty={translator.text("Bundle limits empty", "No limits")}
					items={bundle.limits}
					renderFn={(limit) => (
						<Typo label={`${limit.limit} ${limit.resourceDefinitionId}`} />
					)}
				/>

				<ValueList
					data-ui={"BundleItem-[Features]"}
					textLabel={translator.text("Bundle features (label)", "Features")}
					textEmpty={translator.text("Bundle features empty", "No features")}
					items={bundle.features}
					renderFn={(feature) => <Typo label={feature.resourceDefinitionId} />}
				/>
			</Container>

			<CheckoutButton
				bundle={bundle.bundle}
				isActive={isActive}
			/>
		</Container>
	);
};

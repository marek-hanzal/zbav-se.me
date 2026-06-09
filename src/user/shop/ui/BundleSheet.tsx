import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { CloseButton } from "~/common/ui/button";
import type { BundleSchema } from "~/user/stripe/server/schema/BundleSchema";
import { CancelButton } from "./CancelButton";
import { CheckoutButton } from "./CheckoutButton";

export namespace BundleSheet {
	export interface Props {
		bundle: BundleSchema.Type;
		description: string;
		isOpen: boolean;
		onClose(): void;
	}
}

export const BundleSheet: FC<BundleSheet.Props> = ({ bundle, description, isOpen, onClose }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const price = (
		<PriceInline
			price={bundle.price / 100}
			locale={locale}
			currency={bundle.currency.toUpperCase()}
		/>
	);

	return (
		<BottomSheet
			data-ui="BundleSheet"
			isOpen={isOpen}
			onClose={onClose}
			detent="full"
			contentProps={{
				disableScroll: true,
			}}
			withHeader
			header={({ close }) => ({
				title: bundle.name,
				right: <CloseButton onClick={close} />,
			})}
		>
			<Container
				data-ui="BundleSheet-[Content]"
				data-ui-layout="vertical-flex"
				data-ui-gap="default"
				data-ui-inner="default"
				data-ui-height="full"
				data-ui-scroll="vertical"
			>
				<Group>
					<LabelValue
						textLabel="Price (label)"
						textValue={price}
					/>
				</Group>

				<Group>
					<LabelValue
						textLabel="Description (label)"
						textValue={<Typo label={description} />}
					/>
				</Group>

				<Group>
					<ValueList
						data-ui="BundleSheet-[Items]"
						textLabel="Bundle items (label)"
						textEmpty="Bundle items empty"
						items={bundle.items}
						renderFn={(item) => (
							<Typo
								label={`${toLocaleNumber({
									number: item.amount,
									locale,
								})}× ${translator.text(
									`Resource definition - ${item.resourceDefinitionId} (label)`,
								)}`}
							/>
						)}
					/>
				</Group>

				<Group>
					<ValueList
						data-ui="BundleSheet-[Limits]"
						textLabel="Bundle limits (label)"
						textEmpty="Bundle limits empty"
						items={bundle.limits}
						renderFn={(limit) => (
							<Typo
								label={`${toLocaleNumber({
									number: limit.limit,
									locale,
								})} ${translator.text(
									`Resource definition - ${limit.resourceDefinitionId} (label)`,
								)}`}
							/>
						)}
					/>
				</Group>

				<Group>
					<ValueList
						data-ui="BundleSheet-[Features]"
						textLabel="Bundle features (label)"
						textEmpty="Bundle features empty"
						items={bundle.features}
						renderFn={(feature) => (
							<Typo
								label={translator.text(
									`Resource definition - ${feature.resourceDefinitionId} (label)`,
								)}
							/>
						)}
					/>
				</Group>

				<Group>
					{!bundle.active ? (
						<CheckoutButton bundle={bundle.bundle} />
					) : !bundle.active.cancelAtPeriodEnd ? (
						<CancelButton bundle={bundle.bundle} />
					) : null}
				</Group>
			</Container>
		</BottomSheet>
	);
};

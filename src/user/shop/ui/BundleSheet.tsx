import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
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
		isOpen: boolean;
		onClose(): void;
	}
}

export const BundleSheet: FC<BundleSheet.Props> = ({ bundle, isOpen, onClose }) => {
	const locale = useLocale();
	const translator = useTranslator();

	return (
		<BottomSheet
			data-ui="BundleSheet"
			isOpen={isOpen}
			onClose={onClose}
			detent="default"
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
				data-ui-layout="vertical-flex"
				data-ui-gap="default"
				data-ui-inner="default"
				data-ui-height="full"
				data-ui-scroll="vertical"
			>
				<Group>
					<LabelValue
						textLabel={translator.text("Plan description (label)")}
						textValue={<Typo label={bundle.description} />}
					/>
				</Group>

				{bundle.items.length ? (
					<Group>
						<ValueList
							textLabel={translator.text("Bundle items (label)")}
							textEmpty="Bundle items empty"
							items={bundle.items}
							renderFn={(item) => (
								<Container
									data-ui-flow="vertical"
									data-ui-gap="xs"
								>
									<Container
										data-ui-flow="horizontal"
										data-ui-gap="sm"
									>
										<Tx
											label={`Resource definition - ${item.resourceDefinitionId} (label)`}
										/>

										<Typo
											label={`${toLocaleNumber({
												number: item.amount,
												locale,
											})}×`}
										/>
									</Container>

									<Tx
										label={`Resource definition - ${item.resourceDefinitionId} (hint)`}
										data-ui-text="sm"
										data-ui-opacity="6"
									/>
								</Container>
							)}
						/>
					</Group>
				) : null}

				{bundle.limits.length ? (
					<Group>
						<ValueList
							textLabel={translator.text("Bundle limits (label)")}
							textEmpty="Bundle limits empty"
							items={bundle.limits}
							renderFn={(limit) => (
								<Container
									data-ui-flow="vertical"
									data-ui-gap="xs"
									data-ui-width="full"
								>
									<Container
										data-ui-flow="horizontal"
										data-ui-gap="sm"
										data-ui-justify="space-between"
										data-ui-items="center"
										data-ui-width="full"
									>
										<Tx
											label={`Resource definition - ${limit.resourceDefinitionId} (label)`}
										/>

										<Typo
											label={toLocaleNumber({
												number: limit.limit,
												locale,
											})}
										/>
									</Container>

									<Tx
										label={`Resource definition - ${limit.resourceDefinitionId} (hint)`}
										data-ui-text="sm"
										data-ui-opacity="6"
									/>
								</Container>
							)}
						/>
					</Group>
				) : null}

				{bundle.features.length ? (
					<Group>
						<ValueList
							textLabel={translator.text("Bundle features (label)")}
							textEmpty="Bundle features empty"
							items={bundle.features}
							renderFn={(feature) => (
								<Container
									data-ui-flow="vertical"
									data-ui-gap="xs"
								>
									<Tx
										label={`Resource definition - ${feature.resourceDefinitionId} (label)`}
									/>

									<Tx
										label={`Resource definition - ${feature.resourceDefinitionId} (hint)`}
										data-ui-text="sm"
										data-ui-opacity="6"
									/>
								</Container>
							)}
						/>
					</Group>
				) : null}

				<Group>
					{!bundle.active ? (
						<CheckoutButton bundle={bundle} />
					) : !bundle.active.cancelAtPeriodEnd ? (
						<CancelButton bundle={bundle.bundle} />
					) : null}
				</Group>
			</Container>
		</BottomSheet>
	);
};

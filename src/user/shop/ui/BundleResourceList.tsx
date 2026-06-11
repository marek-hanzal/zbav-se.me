import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { ValueList } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import type { ExtraSchema } from "~/user/stripe/server/schema/ExtraSchema";
import type { PackageSchema } from "~/user/stripe/server/schema/PackageSchema";

type Bundle = Pick<ExtraSchema.Type | PackageSchema.Type, "features" | "items" | "limits">;

export namespace BundleResourceList {
	export interface Props {
		bundle: Bundle;
		labelPrefix: "Extra" | "Package";
	}
}

export const BundleResourceList: FC<BundleResourceList.Props> = ({ bundle, labelPrefix }) => {
	const locale = useLocale();

	return (
		<>
			{bundle.items.length ? (
				<Group>
					<ValueList
						textLabel={`${labelPrefix} items (label)`}
						textEmpty={`${labelPrefix} items empty`}
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
						textLabel={`${labelPrefix} limits (label)`}
						textEmpty={`${labelPrefix} limits empty`}
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
						textLabel={`${labelPrefix} features (label)`}
						textEmpty={`${labelPrefix} features empty`}
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
		</>
	);
};

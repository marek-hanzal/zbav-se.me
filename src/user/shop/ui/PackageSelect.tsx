import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withPackageCollectionQuery } from "~/user/stripe/query/withPackageCollectionQuery";
import { PackageItem } from "./PackageItem";

export namespace PackageSelect {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const PackageSelect: FC<PackageSelect.Props> = ({ _suspense, ...props }) => {
	const translator = useTranslator();
	const { data: packages } = withPackageCollectionQuery.useSuspenseQuery({});

	return (
		<Container
			data-ui="PackageSelect"
			data-ui-layout="vertical"
			data-ui-gap="default"
			{...props}
		>
			<Typo
				label={translator.text("Shop subscriptions (title)")}
				preset="subheader"
			/>

			<Container
				data-ui-layout="vertical"
				data-ui-gap="default"
			>
				{packages.map((bundle) => (
					<PackageItem
						key={bundle.bundle}
						bundle={bundle}
					/>
				))}
			</Container>
		</Container>
	);
};

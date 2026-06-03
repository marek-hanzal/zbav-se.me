import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { withBundleCollectionQuery } from "../query/withBundleCollectionQuery";
import { BundleItem } from "./BundleItem";

export namespace BundleSelect {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const BundleSelect: FC<BundleSelect.Props> = ({ _suspense, ...props }) => {
	const { data: bundles } = withBundleCollectionQuery.useSuspenseQuery({});

	return (
		<Container
			data-ui={"BundleSelect"}
			data-ui-layout="vertical"
			data-ui-gap="default"
			{...props}
		>
			{bundles.map((bundle) => (
				<BundleItem
					key={bundle.bundle}
					bundle={bundle}
				/>
			))}
		</Container>
	);
};

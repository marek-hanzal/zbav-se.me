import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import type { BundleSchema } from "../server/schema/BundleSchema";

export namespace BundleItem {
	export interface Props extends Container.Props {
		bundle: BundleSchema.Type;
	}
}

export const BundleItem: FC<BundleItem.Props> = ({ bundle, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			data-ui={"BundleItem"}
			data-ui-layout="vertical"
			data-ui-gap="md"
			{...props}
		></Container>
	);
};

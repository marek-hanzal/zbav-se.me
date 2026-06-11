import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withExtraCollectionQuery } from "~/user/stripe/query/withExtraCollectionQuery";
import { ExtraItem } from "./ExtraItem";

export namespace ExtraSelect {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const ExtraSelect: FC<ExtraSelect.Props> = ({ _suspense, ...props }) => {
	const translator = useTranslator();
	const { data: extras } = withExtraCollectionQuery.useSuspenseQuery({});

	return (
		<Container
			data-ui="ExtraSelect"
			data-ui-layout="vertical"
			data-ui-gap="default"
			{...props}
		>
			<Typo
				label={translator.text("Shop extras (title)")}
				preset="subheader"
			/>

			<Container
				data-ui-layout="vertical"
				data-ui-gap="default"
			>
				{extras.map((extra) => (
					<ExtraItem
						key={extra.bundle}
						bundle={extra}
					/>
				))}
			</Container>
		</Container>
	);
};

import type { FC } from "react";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { withListingAttrOfQuery } from "../query/withListingAttrOfQuery";
import { ListingAttrOf } from "./ListingAttrOf";

export namespace AttrSection {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		categoryId: string;
	}
}

export const AttrSection: FC<AttrSection.Props> = ({ listingId, categoryId, ...props }) => {
	const { data: attrs } = withListingAttrOfQuery.useSuspenseQuery({
		listingId,
		categoryId,
		nonEmpty: true,
	});

	if (!attrs.length) {
		return null;
	}

	return (
		<Container
			data-ui={"AttrSection"}
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			{attrs.map((attr) => {
				return (
					<Group key={`attr-${attr.name}`}>
						<ListingAttrOf attrOf={attr} />
					</Group>
				);
			})}
		</Container>
	);
};

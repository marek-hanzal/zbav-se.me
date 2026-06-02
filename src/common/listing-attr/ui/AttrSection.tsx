import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import type { MarkSuspense } from "@/lib/client/type";
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

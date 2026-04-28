import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { withListingQuery } from "../../query/withListingQuery";

export namespace Editor {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, listingId, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	return (
		<Container
			data-ui-flow="vertical"
			data-ui-scroll="vertical"
			data-ui-inner="default"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			<Group>
				<CurrentRestriction _suspense={_suspense} />
			</Group>

			<Group>
				<GalleryValue
					urls={listing.withImageUrl}
					label={translator.text("Listing photo gallery (label)")}
					// onClick={() => onView("gallery")}
					statusProps={{
						"data-ui-tone": listing.withImageUrl.length > 0 ? "neutral" : "primary",
					}}
				/>
			</Group>
		</Container>
	);
};

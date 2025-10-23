import { Container } from "@use-pico/client";
import { type FC, memo, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Content } from "~/app/listing/ui/CreateListing/Content";

export namespace CreateListing {
	export interface Props {
		locale: string;
	}
}

export const CreateListing: FC<CreateListing.Props> = memo(({ locale }) => {
	const listingRef = useRef<HTMLDivElement>(null);
	const useCreateListingStore = useCreateListingContext();
	const isValid = useCreateListingStore((store) => store.isValid);

	return (
		<Container
			ref={listingRef}
			layout={"vertical-full"}
			snap={"vertical-start"}
			gap={"md"}
			tweak={{
				slot: {
					root: {
						class: isValid
							? []
							: [
									"touch-pan-x",
									"[&_*]:touch-pan-x",
									"overscroll-y-contain",
								],
					},
				},
			}}
		>
			<Content
				listingRef={listingRef}
				locale={locale}
			/>
		</Container>
	);
});

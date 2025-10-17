import { Container, useSnapperNav } from "@use-pico/client";
import { type FC, useRef } from "react";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionWrapper";
import { IntroWrapper } from "~/app/listing/ui/CreateListing/Intro/IntroWrapper";
import { LocationWrapper } from "~/app/listing/ui/CreateListing/Location/LocationWrapper";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";

export namespace CreateListing {
	export interface Props {
		locale: string;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ locale }) => {
	const listingRef = useRef<HTMLDivElement>(null);
	const listingNav = useSnapperNav({
		containerRef: listingRef,
		orientation: "vertical",
		count: 7,
	});

	return (
		<Container
			ref={listingRef}
			layout={"vertical-full"}
			snap={"vertical-start"}
			gap={"md"}
		>
			<IntroWrapper listingNav={listingNav} />

			<PhotosWrapper listingNav={listingNav} />

			<CategoryGroupWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<CategoryWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<ConditionWrapper listingNav={listingNav} />

			<PriceWrapper locale={locale} />

			<LocationWrapper locale={locale} />

			<SubmitWrapper />
		</Container>
	);
};

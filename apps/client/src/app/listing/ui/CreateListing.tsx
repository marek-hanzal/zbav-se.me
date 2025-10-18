import { Container, useSnapperNav } from "@use-pico/client";
import { type FC, useRef } from "react";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionAgeWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionAgeWrapper";
import { ConditionOverallWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionOverallWrapper";
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
		count: 9,
	});

	return (
		<Container
			ref={listingRef}
			layout={"vertical-full"}
			snap={"vertical-start"}
			gap={"md"}
		>
			<IntroWrapper listingNavApi={listingNav.api} />

			<PhotosWrapper listingNavApi={listingNav.api} />

			<CategoryGroupWrapper
				listingNavApi={listingNav.api}
				locale={locale}
			/>

			<CategoryWrapper
				listingNavApi={listingNav.api}
				locale={locale}
			/>

			<ConditionOverallWrapper listingNavApi={listingNav.api} />

			<ConditionAgeWrapper listingNavApi={listingNav.api} />

			<PriceWrapper
				listingNavApi={listingNav.api}
				locale={locale}
			/>

			<LocationWrapper
				listingNavApi={listingNav.api}
				locale={locale}
			/>

			<SubmitWrapper listingNavApi={listingNav.api} />
		</Container>
	);
};

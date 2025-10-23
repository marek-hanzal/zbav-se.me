import { useSnapperNav } from "@use-pico/client";
import { type FC, memo, type RefObject } from "react";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionAgeWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionAgeWrapper";
import { ConditionOverallWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionOverallWrapper";
import { IntroWrapper } from "~/app/listing/ui/CreateListing/Intro/IntroWrapper";
import { LocationWrapper } from "~/app/listing/ui/CreateListing/Location/LocationWrapper";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";

export namespace Content {
	export interface Props {
		listingRef: RefObject<HTMLDivElement | null>;
		locale: string;
	}
}

export const Content: FC<Content.Props> = memo(({ listingRef, locale }) => {
	const listingNav = useSnapperNav({
		containerRef: listingRef,
		orientation: "vertical",
		count: 9,
		threshold: 0.65,
	});

	return (
		<>
			<IntroWrapper listingNavApi={listingNav.api} />

			<PhotosWrapper listingNav={listingNav} />

			<CategoryGroupWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<CategoryWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<ConditionOverallWrapper listingNav={listingNav} />

			<ConditionAgeWrapper listingNav={listingNav} />

			<PriceWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<LocationWrapper
				listingNav={listingNav}
				locale={locale}
			/>

			<SubmitWrapper listingNavApi={listingNav.api} />
		</>
	);
});

import { Container, useSnapperNav } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type FC, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionAgeWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionAgeWrapper";
import { ConditionOverallWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionOverallWrapper";
import { IntroWrapper } from "~/app/listing/ui/CreateListing/Intro/IntroWrapper";
import { LocationWrapper } from "~/app/listing/ui/CreateListing/Location/LocationWrapper";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";
import { ThemeCls } from "~/app/ui/ThemeCls";

export namespace CreateListing {
	export interface Props {
		locale: string;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ locale }) => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const requiredCount = useCreateListingStore((store) => store.requiredCount);
	const listingRef = useRef<HTMLDivElement>(null);
	const listingNav = useSnapperNav({
		containerRef: listingRef,
		orientation: "vertical",
		count: 9,
	});
	const { slots } = useCls(ThemeCls);

	return (
		<Container position={"relative"}>
			<div
				className={slots.default({
					slot: {
						default: {
							class: [
								"absolute",
								"top-1",
								"left-2",
								"right-2",
								"h-1",
								"z-[50]",
							],
							token: [
								"round.full",
							],
						},
					},
				})}
			>
				<div
					className={slots.default({
						slot: {
							default: {
								class: [
									"h-1",
									"w-full",
									"transition-all",
								],
								token: [
									"round.full",
									"tone.primary.dark.bg",
								],
							},
						},
					})}
					style={{
						opacity: Math.max(
							0.1,
							missing.length / (requiredCount - 1),
						),
						width: `${Math.min(100, 100 - (missing.length / requiredCount) * 100)}%`,
					}}
				/>
			</div>

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

				<PriceWrapper locale={locale} />

				<LocationWrapper locale={locale} />

				<SubmitWrapper />
			</Container>
		</Container>
	);
};

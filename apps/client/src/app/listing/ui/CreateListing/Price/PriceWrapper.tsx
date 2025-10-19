import {
	type useSnapperNav as SnapperNavType,
	useSnapperNav,
} from "@use-pico/client";
import { type FC, memo, useRef, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { NextButton } from "~/app/listing/ui/CreateListing/NextButton";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Dial } from "~/app/ui/dial/Dial";
import { anim, useAnim } from "~/app/ui/gsap";
import { Title } from "~/app/ui/title/Title";

export namespace PriceWrapper {
	export interface Props {
		listingNav: SnapperNavType.Result;
		locale: string;
	}
}

export const PriceWrapper: FC<PriceWrapper.Props> = memo(
	({ listingNav, locale }) => {
		const useCreateListingStore = useCreateListingContext();
		const price = useCreateListingStore((store) => store.price);
		const setPrice = useCreateListingStore((store) => store.setPrice);
		const hasPrice = useCreateListingStore((store) => store.hasPrice);
		const rootRef = useRef<HTMLDivElement>(null);
		const priceRef = useRef<HTMLDivElement>(null);
		const [cost, setCost] = useState(price);

		const snapperNav = useSnapperNav({
			containerRef: rootRef,
			orientation: "horizontal",
			defaultIndex: hasPrice ? 0 : 1,
			count: 2,
		});

		const onPrice = (price: number | undefined) => {
			setPrice(price);
		};

		const onClear = () => {
			setPrice(undefined);
		};

		useAnim(
			() => {
				snapperNav.api.snapTo(price === undefined ? 1 : 0);

				anim.timeline()
					.to(priceRef.current, {
						opacity: 0,
						scale: 1.25,
						y: "-50%",
						onComplete() {
							setCost(price);
						},
					})
					.to(priceRef.current, {
						opacity: 1,
						scale: 1,
						y: 0,
					});
			},
			{
				scope: rootRef,
				dependencies: [
					price,
				],
			},
		);

		return (
			<FlowContainer>
				<ListingProgress />

				<Title
					textTitle={"Price (title)"}
					left={<LeftButton listingNavApi={listingNav.api} />}
				/>

				<Dial
					locale={locale}
					value={price}
					onChange={onPrice}
				/>

				<BottomContainer>
					<div />

					<NextButton
						listingNavApi={listingNav.api}
						disabled={!hasPrice}
					/>
				</BottomContainer>
			</FlowContainer>
		);
	},
);

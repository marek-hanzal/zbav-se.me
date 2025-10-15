import {
	Container,
	SnapperNav,
	Status,
	Tx,
	useSnapperNav,
} from "@use-pico/client";
import { type FC, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Price } from "~/app/listing/ui/CreateListing/Price/Price";
import { Sheet } from "~/app/sheet/Sheet";
import { Dial } from "~/app/ui/dial/Dial";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

export const PriceWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const price = useCreateListingStore((store) => store.price);
	const setPrice = useCreateListingStore((store) => store.setPrice);
	const hasPrice = useCreateListingStore((store) => store.hasPrice);
	const rootRef = useRef<HTMLDivElement>(null);

	const snapperNav = useSnapperNav({
		containerRef: rootRef,
		orientation: "horizontal",
		defaultIndex: hasPrice ? 0 : 1,
		count: 2,
	});

	const onPrice = (price: number) => {
		snapperNav.snapTo(Number.isNaN(price) ? 1 : 0);
		setPrice(price);
	};

	const onClear = () => {
		snapperNav.snapTo(1);
		setPrice(NaN);
	};

	return (
		<Container position={"relative"}>
			<SnapperNav
				containerRef={rootRef}
				pages={{
					count: 2,
				}}
				orientation={"horizontal"}
				iconProps={() => ({
					size: "xs",
				})}
				subtle
			/>

			<Container
				ref={rootRef}
				layout={"horizontal-full"}
				overflow={"horizontal"}
				snap={"horizontal-start"}
				gap={"md"}
			>
				<Sheet>
					<Status
						icon={PriceIcon}
						textTitle={<Tx label={"Price (label)"} />}
						textMessage={
							<Price
								price={price}
								onClear={onClear}
							/>
						}
					/>
				</Sheet>

				<Sheet>
					<Dial
						value={price}
						onChange={onPrice}
					/>
				</Sheet>
			</Container>
		</Container>
	);
};

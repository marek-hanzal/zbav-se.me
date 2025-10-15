import {
	Button,
	Container,
	SnapperNav,
	Status,
	Tx,
	useSnapperNav,
} from "@use-pico/client";
import { type FC, useRef, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Price } from "~/app/listing/ui/CreateListing/Price/Price";
import { Sheet } from "~/app/sheet/Sheet";
import { Dial } from "~/app/ui/dial/Dial";
import { anim, useAnim } from "~/app/ui/gsap";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

export namespace PriceWrapper {
	export interface Props {
		locale: string;
	}
}

export const PriceWrapper: FC<PriceWrapper.Props> = ({ locale }) => {
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
			snapperNav.snapTo(price === undefined ? 1 : 0);

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
						ref={priceRef}
						icon={PriceIcon}
						textTitle={
							cost === undefined ? (
								<Button
									onClick={() => snapperNav.next()}
									size={"xl"}
									tone={"secondary"}
									theme={"dark"}
								>
									<Tx label={"Price not set (button)"} />
								</Button>
							) : (
								<Tx label={"Price (label)"} />
							)
						}
						tweak={{
							slot: {
								body: {
									class: [
										"w-full",
										"px-8",
									],
								},
							},
						}}
					>
						{cost === undefined ? null : (
							<Price
								locale={locale}
								price={cost}
								onClear={onClear}
							/>
						)}
					</Status>
				</Sheet>

				<Sheet>
					<Dial
						locale={locale}
						value={price}
						onChange={onPrice}
					/>
				</Sheet>
			</Container>
		</Container>
	);
};

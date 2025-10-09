import { Status, Tx } from "@use-pico/client";
import { type FC, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Price } from "~/app/listing/ui/CreateListing/Price/Price";
import { Sheet } from "~/app/sheet/Sheet";
import { Dial } from "~/app/ui/dial/Dial";
import { anim, useAnim } from "~/app/ui/gsap";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

export const PriceWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const price = useCreateListingStore((store) => store.price);
	const setPrice = useCreateListingStore((store) => store.setPrice);
	const hasPrice = useCreateListingStore((store) => store.hasPrice);
	const rootRef = useRef<HTMLDivElement>(null);
	const statusRef = useRef<HTMLDivElement>(null);
	const dialRef = useRef<HTMLDivElement>(null);

	const { contextSafe } = useAnim(
		() => {
			anim.set(
				statusRef.current,
				hasPrice
					? {
							autoAlpha: 1,
							scale: 1,
						}
					: {
							autoAlpha: 0,
							scale: 0.8,
						},
			);

			anim.set(
				dialRef.current,
				hasPrice
					? {
							autoAlpha: 0,
							scale: 0.8,
						}
					: {
							autoAlpha: 1,
							scale: 1,
						},
			);
		},
		{
			dependencies: [],
			scope: rootRef,
		},
	);

	const onPrice = contextSafe((price: number) => {
		if (Number.isNaN(price)) {
			return;
		}

		anim.timeline({
			defaults: {
				duration: 0.2,
			},
		})
			.to(dialRef.current, {
				autoAlpha: 0,
				scale: 0.8,
				onComplete() {
					setPrice(price);
				},
			})
			.to(statusRef.current, {
				autoAlpha: 1,
				scale: 1,
			});
	});
	const onClear = contextSafe(() => {
		anim.timeline({
			defaults: {
				duration: 0.2,
			},
		})
			.to(statusRef.current, {
				autoAlpha: 0,
				scale: 0.8,
				onComplete() {
					setPrice(NaN);
				},
			})
			.to(dialRef.current, {
				autoAlpha: 1,
				scale: 1,
			});
	});

	return (
		<Sheet
			ref={rootRef}
			tweak={{
				slot: {
					root: {
						class: [
							"relative",
						],
					},
				},
			}}
		>
			<Status
				ref={statusRef}
				icon={PriceIcon}
				textTitle={<Tx label={"Price (label)"} />}
				textMessage={
					<Price
						price={price}
						onClear={onClear}
					/>
				}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-1/2",
								"left-1/2",
								"-translate-x-1/2",
								"-translate-y-1/2",
							],
						},
					},
				}}
			/>

			<Dial
				ref={dialRef}
				value={price}
				onChange={onPrice}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-1/2",
								"left-1/2",
								"-translate-x-1/2",
								"-translate-y-1/2",
							],
						},
					},
				}}
			/>
		</Sheet>
	);
};

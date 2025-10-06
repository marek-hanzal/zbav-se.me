import { Container, SnapperNav } from "@use-pico/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type FC, useMemo, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { anim, useAnim } from "~/app/ui/gsap";
import { DotIcon } from "~/app/ui/icon/DotIcon";

export const PhotosWrapper: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const photoCountLimit = useCreateListingStore(
		(store) => store.photoCountLimit,
	);
	const photos = useCreateListingStore((store) => store.photos);

	const pages: SnapperNav.Page[] = useMemo(
		() =>
			Array.from(
				{
					length: photoCountLimit,
				},
				(_, index) =>
					({
						id: `p-${index + 1}`,
						icon: DotIcon,
						iconProps() {
							return photos[index]
								? {
										tone: "secondary",
									}
								: {
										tone: "primary",
									};
						},
					}) satisfies SnapperNav.Page,
			),
		[
			photoCountLimit,
			photos,
		],
	);

	const rootRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useAnim(
		() => {
			const items = anim.utils.toArray<HTMLElement>(".PhotoSlot-root");

			ScrollTrigger.create({
				scroller: containerRef.current,
				snap: {
					snapTo: 1 / (photoCountLimit - 1),
					delay: 0,
					duration: 0.25,
					ease: "power2.inOut",
					directional: false,
					inertia: false,
				},
			});

			items.forEach((el) => {
				anim.timeline({
					defaults: {
						ease: "power2.inOut",
						duration: 0.15,
					},
					scrollTrigger: {
						trigger: el,
						scroller: containerRef.current,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
					},
				})
					.fromTo(
						el,
						{
							opacity: 0.9,
							scale: 0.95,
							x: 16,
						},
						{
							opacity: 1,
							scale: 1,
							x: 0,
						},
					)
					.to(el, {
						opacity: 0.9,
						scale: 0.95,
						x: 16,
					});
			});

			ScrollTrigger.refresh();
		},
		{
			scope: rootRef,
			dependencies: [
				photoCountLimit,
				pages.length,
			],
		},
	);

	return (
		<Container ref={rootRef}>
			<SnapperNav
				containerRef={containerRef}
				pages={pages}
				orientation="vertical"
				iconProps={() => ({
					size: "xs",
				})}
			/>

			<Container
				ref={containerRef}
				layout="vertical-full"
				overflow={"vertical"}
				gap={"md"}
			>
				{pages.map((_, slot) => {
					const disabled = slot > 0 && !photos[slot - 1];

					return (
						<PhotoSlot
							key={`photo-${slot + 1}`}
							slot={slot}
							disabled={disabled}
						/>
					);
				})}
			</Container>
		</Container>
	);
};

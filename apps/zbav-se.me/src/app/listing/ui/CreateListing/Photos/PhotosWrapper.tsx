import { Container, SnapperNav } from "@use-pico/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type FC, useMemo, useRef } from "react";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { anim, useAnim } from "~/app/ui/gsap";
import { DotIcon } from "~/app/ui/icon/DotIcon";

export namespace PhotosWrapper {
	export interface Props {
		count: number;
		/**
		 * Array of photos - should be exactly count long.
		 *
		 * "null" represents an empty slot, but values should be ordered by "filled" first,
		 * this component is only wrapper rendering what's on input.
		 */
		value: PhotoSlot.Value[];
		/**
		 * Reports back changed slots.
		 */
		onChange: PhotoSlot.OnChangeFn;
	}
}

export const PhotosWrapper: FC<PhotosWrapper.Props> = ({
	count,
	value,
	onChange,
}) => {
	const pages: SnapperNav.Page[] = useMemo(
		() =>
			Array.from(
				{
					length: count,
				},
				(_, index) =>
					({
						id: `p-${index + 1}`,
						icon: DotIcon,
						iconProps() {
							return value[index]
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
			count,
			value,
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
					snapTo: 1 / (count - 1),
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
				count,
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
					const disabled = slot > 0 && value[slot - 1] === null;

					return (
						<PhotoSlot
							key={`photo-${slot + 1}`}
							slot={slot}
							disabled={disabled}
							value={value[slot] ?? null}
							onChange={onChange}
						/>
					);
				})}
			</Container>
		</Container>
	);
};

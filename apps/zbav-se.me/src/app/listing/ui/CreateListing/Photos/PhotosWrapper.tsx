import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type FC, useMemo, useRef } from "react";
import { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { Container } from "~/app/ui/container/Container";
import { anim, useAnim } from "~/app/ui/gsap";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { SnapperNav } from "~/app/ui/scroll/Snapper";

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
				(_, index) => ({
					id: `p-${index + 1}`,
					icon: DotIcon,
				}),
			),
		[
			count,
		],
	);

	const rootRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useAnim(
		() => {
			const items = anim.utils.toArray<HTMLElement>(
				"[data-ui='PhotoSlot-root']",
			);

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
						ease: "power1.inOut",
						duration: 0.05,
					},
					scrollTrigger: {
						trigger: el,
						scroller: containerRef.current,
						start: "top bottom",
						end: "bottom top",
						scrub: 0.1,
					},
				})
					.fromTo(
						el,
						{
							opacity: 0.15,
							scale: 0.85,
							rotateZ: 4,
							// x: -32,
						},
						{
							opacity: 1,
							scale: 1,
							rotateZ: 0,
							x: 0,
						},
					)
					.to(el, {
						opacity: 0.15,
						scale: 0.85,
						rotateZ: -4,
						// x: 32,
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
		<Container
			position="relative"
			ref={rootRef}
		>
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
				orientation="vertical-full"
				// snap="vertical-start"
				overflow={"vertical"}
				// gap="xs"
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

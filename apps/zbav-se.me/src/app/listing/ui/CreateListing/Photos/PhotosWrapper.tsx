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
			const scroller = containerRef.current;
			if (!scroller) {
				return;
			}

			// vybereme všechny PhotoSloty uvnitř scope (rootRef)
			const items = anim.utils.toArray<HTMLElement>(
				"[data-ui='PhotoSlot-root']",
			);

			// inicializace (aby nic neblikalo při mountu)
			items.forEach((el) => {
				anim.set(el, {
					opacity: 0,
					scale: 0.96,
					transformOrigin: "50% 50%",
					willChange: "transform, opacity",
				});

				// pro každý slot vytvoříme vlastní ScrollTrigger s callbacks
				ScrollTrigger.create({
					trigger: el,
					scroller,
					start: "top center",
					end: "bottom center",
					// markers: true, // odkomentuj pro ladění
					onEnter: () => {
						anim.to(el, {
							opacity: 1,
							scale: 1,
							duration: 0.28,
							ease: "power2.out",
							overwrite: "auto",
						});
					},
					onLeave: () => {
						anim.to(el, {
							opacity: 0,
							scale: 0.94,
							duration: 0.22,
							ease: "power2.in",
							overwrite: "auto",
						});
					},
					onEnterBack: () => {
						anim.to(el, {
							opacity: 1,
							scale: 1,
							duration: 0.28,
							ease: "power2.out",
							overwrite: "auto",
						});
					},
					onLeaveBack: () => {
						anim.to(el, {
							opacity: 0,
							scale: 0.94,
							duration: 0.22,
							ease: "power2.in",
							overwrite: "auto",
						});
					},
				});
			});

			// po vytvoření triggerů refresh, ať si sednou se snapem
			ScrollTrigger.refresh();
		},
		{
			scope: rootRef,
			// když se změní počet stránek/slotů, re-init
			dependencies: [
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
				snap="vertical-start"
				gap="xs"
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
							// dbej na to, aby root PhotoSlotu měl className="PhotoSlot-root"
						/>
					);
				})}
			</Container>
		</Container>
	);
};

import { Icon } from "@use-pico/client";
import { type FC, useEffect, useState } from "react";
import { useSnapper } from "./Snapper";

export namespace SnapperPager {
	export interface Page {
		id: string;
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
	}

	export interface Props {
		pages: Page[];
	}
}

export const SnapperPager: FC<SnapperPager.Props> = ({ pages }) => {
	const { viewportRef } = useSnapper();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport || pages.length <= 1) {
			return;
		}

		const update = () => {
			const height = viewport.clientHeight || 1;
			const index = Math.round(viewport.scrollTop / height);
			const max = Math.max(0, pages.length - 1);
			setIndex(Math.min(Math.max(index, 0), max));
		};

		update();
		viewport.addEventListener("scroll", update, {
			passive: true,
		});

		const resizeObserver = new ResizeObserver(update);
		resizeObserver.observe(viewport);

		window.addEventListener("resize", update);

		return () => {
			viewport.removeEventListener("scroll", update);
			resizeObserver.disconnect();
			window.removeEventListener("resize", update);
		};
	}, [
		viewportRef,
		pages,
	]);

	const goTo = (i: number) => {
		const viewport = viewportRef.current;
		if (!viewport) {
			return;
		}
		const max = Math.max(0, pages.length - 1);
		const target = Math.min(Math.max(i, 0), max);
		viewport.scrollTo({
			top: target * (viewport.clientHeight || 1),
			behavior: "smooth",
		});
	};

	if (pages.length <= 1) {
		return null;
	}

	return (
		<div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
			<div className="flex flex-col gap-4 opacity-50">
				{pages.map(({ id, icon, iconProps }, i) => {
					const active = i === index;
					return (
						<Icon
							key={id}
							onClick={() => goTo(i)}
							icon={icon}
							tone={"secondary"}
							size="md"
							tweak={({ what }) => ({
								slot: what.slot({
									root: what.css([
										"pointer-events-auto select-none transition",
										active
											? "scale-125 opacity-100"
											: "opacity-60 hover:opacity-90",
									]),
								}),
							})}
							{...iconProps}
						/>
					);
				})}
			</div>
		</div>
	);
};

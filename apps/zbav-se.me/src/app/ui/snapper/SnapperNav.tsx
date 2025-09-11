import { Icon } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type FC, useEffect, useState } from "react";
import { SnapperNavCls } from "~/app/ui/snapper/SnapperNavCls";
import { useSnapper } from "./useSnapper";

export namespace SnapperNav {
	export interface Page {
		id: string;
		icon: Icon.Type;
		iconProps?: Icon.PropsEx;
	}

	export interface Props extends SnapperNavCls.Props {
		pages: Page[];
	}
}

export const SnapperNav: FC<SnapperNav.Props> = ({
	cls = SnapperNavCls,
	tweak,
	pages,
}) => {
	const { viewportRef, orientation } = useSnapper();
	const [index, setIndex] = useState(0);
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			orientation,
		}),
	}));

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
		<div className={slots.root()}>
			<div className={slots.items()}>
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

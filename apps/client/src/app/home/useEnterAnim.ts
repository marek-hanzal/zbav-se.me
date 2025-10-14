import type { RefObject } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

export const useEnterAnim = (rootRef: RefObject<HTMLElement | null>) => {
	useAnim(
		() => {
			const elements = anim.utils.toArray<HTMLElement>(".reveal");
			elements.forEach((el, index) => {
				anim.fromTo(
					el,
					{
						opacity: 0,
						y: 48,
					},
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						delay: Math.min(index * 0.05, 0.3),
						scrollTrigger: {
							trigger: el,
							scroller: rootRef.current,
							start: "top 85%",
							end: "bottom 30%",
							toggleActions: "play none none none",
							once: true,
						},
					},
				);
			});
		},
		{
			dependencies: [],
		},
	);
};

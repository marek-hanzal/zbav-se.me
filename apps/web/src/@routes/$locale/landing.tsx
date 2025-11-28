import { createFileRoute } from "@tanstack/react-router";
import { useSnapperNav } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { SnapperNav } from "@use-pico/client/ui/snapper-nav";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { Fade } from "@zbav-se.me/ui/fade";
import { useRef } from "react";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";

export const Route = createFileRoute("/$locale/landing")({
	component() {
		const { locale } = Route.useParams();
		const scrollerRef = useRef<HTMLDivElement>(null);

		useEnterAnim(scrollerRef);

		const snapperNav = useSnapperNav({
			containerRef: scrollerRef,
			orientation: "vertical",
			count: 5,
		});

		return (
			<Container>
				<Fade scrollableRef={scrollerRef} />

				<SnapperNav
					snapperNav={snapperNav}
					iconProps={() => ({
						size: "xs",
						tone: "secondary",
						theme: "light",
					})}
					limit={7}
					subtle
					orientation={"vertical"}
				/>

				<Container
					ref={scrollerRef}
					layout={"vertical-full"}
					snap={"vertical-start"}
					gap={"md"}
				>
					<HeroSheet locale={locale} />

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
						}}
					>
						<WhatSheet />
					</VariantProvider>

					<FeaturesSheet />

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
						}}
					>
						<CtaSheet locale={locale} />
					</VariantProvider>

					<ContactSheet />
				</Container>
			</Container>
		);
	},
});

import { createFileRoute } from "@tanstack/react-router";
import { Container, SnapperNav, useSnapperNav } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui";
import { Fade } from "@zbav-se.me/ui/src/fade/Fade";
import { SecondaryOverlay } from "@zbav-se.me/ui/src/overlay/SecondaryOverlay";
import { useRef } from "react";
import { AboutSheet } from "~/app/home/AboutSheet";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";

export const Route = createFileRoute("/$locale/landing")({
	async loader({ params: { locale } }) {
		return {
			about: await import(`../../@md/about/${locale}.md?raw`).then(
				(m) => m.default,
			),
		};
	},
	component() {
		const { about } = Route.useLoaderData();
		const scrollerRef = useRef<HTMLDivElement>(null);

		useEnterAnim(scrollerRef);

		const snapperNav = useSnapperNav({
			containerRef: scrollerRef,
			orientation: "vertical",
			count: 5,
		});

		return (
			<Container>
				<SecondaryOverlay />

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
					<HeroSheet />

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
						<CtaSheet />
					</VariantProvider>

					<ContactSheet />

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
						}}
					>
						<AboutSheet markdown={about} />
					</VariantProvider>
				</Container>
			</Container>
		);
	},
});

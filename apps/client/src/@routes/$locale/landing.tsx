import { createFileRoute } from "@tanstack/react-router";
import { Container, SnapperNav } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { useRef } from "react";
import { AboutSheet } from "~/app/home/AboutSheet";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";
import { Fade } from "~/app/ui/fade/Fade";
import { SecondaryOverlay } from "~/app/ui/overlay/SecondaryOverlay";
import { ThemeCls } from "~/app/ui/ThemeCls";

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

		return (
			<Container>
				<SecondaryOverlay />

				<Fade scrollableRef={scrollerRef} />

				<SnapperNav
					containerRef={scrollerRef}
					iconProps={() => ({
						size: "xs",
						tone: "secondary",
						theme: "light",
					})}
					limit={7}
					pages={{
						count: 6,
					}}
					tweak={{
						slot: {
							root: {
								class: [
									"bg-white/0",
								],
							},
						},
					}}
					orientation={"vertical"}
				/>

				<Container
					ref={scrollerRef}
					layout={"vertical-full"}
					overflow={"vertical"}
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

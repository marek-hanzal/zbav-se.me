import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { useRef } from "react";
import { AboutSheet } from "~/app/home/AboutSheet";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";
import { SecondaryOverlay } from "~/app/ui/overlay/SecondaryOverlay";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const scrollerRef = useRef<HTMLDivElement>(null);

		useEnterAnim(scrollerRef);

		return (
			<Container
				ref={scrollerRef}
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<SecondaryOverlay />

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
					<AboutSheet />
				</VariantProvider>

				<CtaSheet />

				<VariantProvider
					cls={ThemeCls}
					variant={{
						tone: "secondary",
					}}
				>
					<ContactSheet />
				</VariantProvider>
			</Container>
		);
	},
});

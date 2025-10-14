import { createFileRoute } from "@tanstack/react-router";
import { Container, SnapperNav } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { useId, useRef } from "react";
import { AboutSheet } from "~/app/home/AboutSheet";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";
import { Fade } from "~/app/ui/fade/Fade";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { SecondaryOverlay } from "~/app/ui/overlay/SecondaryOverlay";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const scrollerRef = useRef<HTMLDivElement>(null);

		const heroId = useId();
		const whatId = useId();
		const featuresId = useId();
		const aboutId = useId();
		const ctaId = useId();
		const contactId = useId();

		useEnterAnim(scrollerRef);

		return (
			<Container>
				<Fade scrollableRef={scrollerRef} />

				<SnapperNav
					containerRef={scrollerRef}
					iconProps={() => ({
						size: "xs",
					})}
					pages={[
						{
							id: heroId,
							icon: DotIcon,
						},
						{
							id: whatId,
							icon: DotIcon,
						},
						{
							id: featuresId,
							icon: DotIcon,
						},
						{
							id: aboutId,
							icon: DotIcon,
						},
						{
							id: ctaId,
							icon: DotIcon,
						},
						{
							id: contactId,
							icon: DotIcon,
						},
					]}
					orientation={"vertical"}
				/>

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
			</Container>
		);
	},
});

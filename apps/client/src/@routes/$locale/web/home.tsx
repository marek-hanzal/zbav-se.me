import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { useRef } from "react";
import { AboutSheet } from "~/app/home/AboutSheet";
import { ContactSheet } from "~/app/home/ContactSheet";
import { CtaSheet } from "~/app/home/CtaSheet";
import { FeaturesSheet } from "~/app/home/FeaturesSheet";
import { HeroSheet } from "~/app/home/HeroSheet";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { WhatSheet } from "~/app/home/WhatSheet";

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
				<HeroSheet />

				<WhatSheet />

				<FeaturesSheet />

				<AboutSheet />

				<CtaSheet />

				<ContactSheet />
			</Container>
		);
	},
});

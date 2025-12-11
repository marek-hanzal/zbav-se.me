import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
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

		return (
			<Container
				data-ui="/landing[Container]"
				ui={{
					position: "relative",
					height: "full",
				}}
			>
				<Fade scrollableRef={scrollerRef} />

				<Container
					data-ui="/landing-[Container.content]"
					ref={scrollerRef}
					ui={{
						layout: "vertical-full",
						snap: "vertical",
						snapAlign: "center",
						gap: "default",
						height: "full",
					}}
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

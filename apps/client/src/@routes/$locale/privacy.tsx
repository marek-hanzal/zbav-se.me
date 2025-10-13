import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { useRef } from "react";
import { Fade } from "~/app/ui/fade/Fade";
import { Markdown } from "~/app/ui/Markdown";

export const Route = createFileRoute("/$locale/privacy")({
	async loader({ params: { locale } }) {
		return import(`../../privacy/${locale}.md?raw`).then(
			(res) => res.default,
		);
	},
	component() {
		const rootRef = useRef<HTMLDivElement>(null);
		const markdown = Route.useLoaderData();

		return (
			<div className={"relative w-full h-full"}>
				<Fade scrollableRef={rootRef} />

				<Container
					ref={rootRef}
					layout={"vertical"}
					overflow={"vertical"}
					tone={"primary"}
					theme={"light"}
					square={"lg"}
				>
					<Markdown>{markdown}</Markdown>
				</Container>
			</div>
		);
	},
});

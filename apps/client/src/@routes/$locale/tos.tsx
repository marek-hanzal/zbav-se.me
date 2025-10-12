import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { useRef } from "react";
import { Fade } from "~/app/ui/fade/Fade";
import { Markdown } from "~/app/ui/Markdown";

const tos = import.meta.glob("/src/tos/*.md", {
	as: "raw",
});

export const Route = createFileRoute("/$locale/tos")({
	async loader({ params: { locale } }) {
		const list = [
			`/src/tos/${locale}.md`,
			"/src/tos/cs.md",
		];

		for (const key of list) {
			const loader = tos[key];
			if (loader) {
				return await loader();
			}
		}

		throw notFound();
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
					round={"xl"}
					square={"lg"}
				>
					<Markdown>{markdown}</Markdown>
				</Container>
			</div>
		);
	},
});

import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { Markdown } from "~/app/ui/Markdown";

const privacy = import.meta.glob("/src/privacy/*.md", {
	as: "raw",
});

export const Route = createFileRoute("/$locale/privacy")({
	async loader({ params: { locale } }) {
		const list = [
			`/src/privacy/${locale}.md`,
			"/src/privacy/cs.md",
		];

		for (const key of list) {
			const loader = privacy[key];
			if (loader) {
				return await loader();
			}
		}

		throw notFound();
	},
	component() {
		const markdown = Route.useLoaderData();

		return (
			<Container
				layout={"vertical"}
				overflow={"vertical"}
				tone={"primary"}
				theme={"light"}
				square={"lg"}
			>
				<Markdown>{markdown}</Markdown>
			</Container>
		);
	},
});

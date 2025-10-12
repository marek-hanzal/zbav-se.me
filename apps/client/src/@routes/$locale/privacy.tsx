import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Typo } from "@use-pico/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
				round={"xl"}
				square={"lg"}
			>
				<ReactMarkdown
					remarkPlugins={[
						remarkGfm,
					]}
					components={{
						h1({ children }) {
							return (
								<Typo
									label={children}
									size={"xl"}
									font={"bold"}
									tone={"primary"}
								/>
							);
						},
					}}
				>
					{markdown}
				</ReactMarkdown>
			</Container>
		);
	},
});

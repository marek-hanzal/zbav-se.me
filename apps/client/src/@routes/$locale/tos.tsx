import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Typo } from "@use-pico/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { OAuthLoginPage } from "~/public/ui/OAuthLoginPage";

const SearchSchema = z.record(z.string(), z.string());

export const Route = createFileRoute("/$locale/oath")({
	validateSearch(search) {
		return SearchSchema.parse(search);
	},
	errorComponent() {
		return (
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
					width: "full",
					inner: "xl",
				}}
			>
				<Status
					textTitle={translator.text("Something went wrong")}
					textMessage={translator.text("Please try again later.")}
					ui={{
						width: "full",
					}}
				/>
			</Container>
		);
	},
	component() {
		const query = Route.useSearch();
		const { locale } = Route.useParams();

		return (
			<OAuthLoginPage
				locale={locale}
				query={query}
			/>
		);
	},
});

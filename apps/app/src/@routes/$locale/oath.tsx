import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { z } from "zod";
import { OAuthLoginPage } from "~/@public/ui/OAuthLoginPage";

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

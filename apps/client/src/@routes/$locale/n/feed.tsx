import { createFileRoute } from "@tanstack/react-router";
import { Container, Tx } from "@use-pico/client";
import { withAutocomplete } from "~/app/ui/geoapify/query/withAutocomplete";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/feed")({
	component() {
		const geoapify = withAutocomplete.useQuery(
			{
				query: "Severní 1175",
				lang: "cs",
			},
			{
				retry: false,
			},
		);

		console.log("result", geoapify.error);

		return (
			<Container layout={"vertical-header-content-footer"}>
				<Title icon={FeedIcon}>
					<Tx
						label={"Feed (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Container height={"full"}>content</Container>

				<Nav active="feed" />
			</Container>
		);
	},
});

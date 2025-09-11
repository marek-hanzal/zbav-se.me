import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<CreateListing photoCountLimit={10} />

				<Nav active="create" />
			</>
		);
	},
});

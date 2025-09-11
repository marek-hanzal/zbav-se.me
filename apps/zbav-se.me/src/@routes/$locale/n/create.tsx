import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
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

				<Snapper>
					<SnapperItem>
						<Title icon={PhotoIcon}>
							<Tx label={"Fotky (title)"} />
						</Title>
					</SnapperItem>

					<SnapperItem>
						<Title icon={PhotoIcon}>
							<Tx label={"Fotky (title)"} />
						</Title>
					</SnapperItem>

					<SnapperItem>
						<Title icon={PhotoIcon}>
							<Tx label={"Fotky (title)"} />
						</Title>
					</SnapperItem>
				</Snapper>

				<Nav active="create" />
			</>
		);
	},
});

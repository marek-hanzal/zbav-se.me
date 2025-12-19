import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { DraftList } from "~/app/draft/ui/DraftList";

export const Route = createFileRoute("/$locale/ui/seller/draft/list")({
	component() {
		return (
			<TitleContainer textTitle={"Draft list (title)"}>
				<DraftList
					query={{
						sort: [
							{
								field: "createdAt",
								direction: "asc",
							},
						],
					}}
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		);
	},
});

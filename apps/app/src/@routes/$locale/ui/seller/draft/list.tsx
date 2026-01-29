import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { DraftList } from "~/app/@seller-user/draft/ui/DraftList";

export const Route = createFileRoute("/$locale/ui/seller/draft/list")({
	component() {
		const locale = useLocale();
		const navigate = Route.useNavigate();

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
					onSuccess={(draft) => {
						navigate({
							to: "/$locale/ui/seller/draft/$id/edit",
							params: {
								locale,
								id: draft.id,
							},
						});
					}}
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		);
	},
});

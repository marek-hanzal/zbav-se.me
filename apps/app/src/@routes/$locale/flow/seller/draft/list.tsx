import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { DraftList } from "~/app/@seller-user/draft/ui/DraftList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/seller/draft/list")({
	component() {
		const locale = useLocale();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				textTitle={translator.text("Draft list (title)")}
				right={<HomeMenuButton />}
			>
				<DraftList
					query={{
						sort: [
							{
								field: "createdAt",
								order: "asc",
							},
						],
					}}
					onSuccess={(draft) => {
						navigate({
							to: "/$locale/flow/seller/draft/$id/edit",
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

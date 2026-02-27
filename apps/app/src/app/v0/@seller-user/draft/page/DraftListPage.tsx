import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { DraftList } from "~/app/v0/@seller-user/draft/ui/DraftList";
import { DraftListPending } from "~/app/v0/@seller-user/draft/ui/DraftListPending";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const DraftListPage: FC<DraftListPage.Props> = (props) => {
	const locale = useLocale();
	const navigate = useNavigate();

	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<DraftListPending />}>
				<DraftList
					_suspense={"I know"}
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
							to: "/$locale/seller/draft/$id/edit",
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
			</Suspense>
		</TitleContainer>
	);
};

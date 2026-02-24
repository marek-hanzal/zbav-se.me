import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { DraftList } from "~/app/@seller-user/draft/ui/DraftList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {}
}

export const DraftListPage: FC<DraftListPage.Props> = ({ children, ui, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();

	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
			right={<HomeMenuButton />}
			ui={ui}
			{...props}
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

			{children}
		</TitleContainer>
	);
};

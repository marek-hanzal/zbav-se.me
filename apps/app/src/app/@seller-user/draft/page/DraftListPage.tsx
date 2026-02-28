import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { DraftList } from "~/app/@seller-user/draft/ui/DraftList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const DraftListPage: FC<DraftListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<DraftList
				query={{
					sort: [
						{
							field: "updatedAt",
							order: "desc",
						},
					],
				}}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};

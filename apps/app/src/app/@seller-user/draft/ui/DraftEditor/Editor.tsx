import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import type { Data } from "~/app/@seller-user/draft/ui/DraftEditor/Data";
import { ActionSection } from "~/app/@seller-user/draft/ui/DraftEditor/ActionSection";
import { OptionalFieldsSection } from "~/app/@seller-user/draft/ui/DraftEditor/OptionalFieldsSection";
import { RequiredFieldsSection } from "~/app/@seller-user/draft/ui/DraftEditor/RequiredFieldsSection";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace Editor {
	export interface Props {
		draft: tDraft;
		onView(view: Data.View): void;
	}
}

export const Editor: FC<Editor.Props> = ({ draft, onView }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft edit (title)")}
			right={<HomeMenuButton />}
		>
			<Container
				data-ui={"DraftEditor-[Container.content]"}
				ui={{
					flow: "vertical",
					scroll: "vertical",
					inner: "default",
					width: "full",
					gap: "lg",
				}}
			>
				<RequiredFieldsSection
					draft={draft}
					onView={onView}
				/>

				<OptionalFieldsSection
					draft={draft}
					onView={onView}
				/>

				<ActionSection draft={draft} />
			</Container>
		</TitleContainer>
	);
};

import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import type { DraftEditor } from "~/app/v0/@seller-user/draft/ui/DraftEditor/DraftEditor";
import { ActionSection } from "./ActionSection";
import { OptionalFieldsSection } from "./OptionalFieldsSection";
import { RequiredFieldsSection } from "./RequiredFieldsSection";

export namespace DraftEditorDefaultView {
	export interface Props {
		draft: tDraft;
		onView(view: DraftEditor.View): void;
	}
}

export const DraftEditorDefaultView: FC<DraftEditorDefaultView.Props> = ({ draft, onView }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft edit (title)")}
			right={<HomeMenuButton />}
		>
			<Container
				data-ui={"DraftEditor-[Container.content]"}
				ui={{
					flow: "vertical",
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

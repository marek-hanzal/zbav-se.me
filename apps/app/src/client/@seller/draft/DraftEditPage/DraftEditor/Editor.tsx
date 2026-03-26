import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/client/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/client/@user/home/~public/HomeMenuButton";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "./DraftEditor";
import { ActionSection } from "./section/ActionSection";
import { OptionalSection } from "./section/OptionalSection";
import { RequiredSection } from "./section/RequiredSection";

export namespace Editor {
	export interface Props extends MarkSuspense.Props {
		draft: DraftSchema.Type;
		locale: string;
		onView(view: DraftEditor.View): void;
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, draft, locale, onView }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft edit (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/seller/draft/list"
					params={{
						locale,
					}}
				/>
			}
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
				<RequiredSection
					_suspense={"I know"}
					draft={draft}
					onView={onView}
				/>

				<OptionalSection
					draft={draft}
					onView={onView}
				/>

				<ActionSection draft={draft} />
			</Container>
		</TitleContainer>
	);
};

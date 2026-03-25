import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/client/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/client/@user/home/~public/HomeMenuButton";
import { DraftList } from "./DraftList";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the draft-list page with title framing and sorted draft collection rendering.
 * Use it as the route-level screen for browsing and continuing seller draft edits.
 *
 * @see apps/app/src/@routes
 */
export const DraftListPage: FC<DraftListPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<DraftList.Fallback />}>
				<DraftList
					_suspense={"I know"}
					ui={{
						inner: "default",
					}}
				/>
			</Suspense>
		</TitleContainer>
	);
};

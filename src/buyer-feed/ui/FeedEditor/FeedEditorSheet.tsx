import { type FC, Suspense } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { FeedEditor } from "~/buyer-feed/ui/FeedEditor/FeedEditor";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";

export namespace FeedEditorSheet {
	export interface Props extends Omit<FeedEditor.Props, "_suspense"> {
		state: StateType.Simple<boolean>;
	}
}

export const FeedEditorSheet: FC<FeedEditorSheet.Props> = ({ state, ...props }) => {
	const translator = useTranslator();
	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.setFn(false);
			}}
			headerFn={({ closeFn }) => ({
				title: translator.textFn("Feed editor (title)"),
				right: (
					<CloseButton
						data-action={"close feed editor"}
						onClick={closeFn}
						data-ui-background={undefined}
						data-ui-shadow={false}
						data-ui-border={false}
					/>
				),
			})}
		>
			<Suspense fallback={<FeedEditor.Fallback />}>
				<FeedEditor
					{...props}
					_suspense={"I know"}
				/>
			</Suspense>
		</BottomSheet>
	);
};

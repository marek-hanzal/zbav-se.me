import { Suspense } from "react";
import { FeedEditor } from "~/buyer/feed/ui/FeedEditor/FeedEditor";
import { Tx } from "~/translation/ui/Tx";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { ResetButton } from "./ResetButton";
import { SaveAsFeedButton } from "./SaveAsFeedButton";
import { SearchButton } from "./SearchButton";

const hidden = [
	"header",
] as const;

export namespace SearchEditor {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const SearchEditor = withFallback(({ _suspense, feedId, ...props }: SearchEditor.Props) => {
	return (
		<Container
			data-ui={"SearchEditor[Container]"}
			data-ui-height="full"
			{...props}
		>
			<FeedEditor
				_suspense={_suspense}
				feedId={feedId}
				hidden={hidden}
			>
				<Tx
					label="Feed - actions (title)"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow="vertical"
					data-ui-gap="default"
				>
					<Group>
						<Suspense fallback={<SearchButton.Fallback feedId={feedId} />}>
							<SearchButton
								_suspense={_suspense}
								feedId={feedId}
							/>
						</Suspense>

						<SaveAsFeedButton
							_suspense={_suspense}
							feedId={feedId}
						/>

						<ResetButton feedId={feedId} />
					</Group>
				</Container>
			</FeedEditor>
		</Container>
	);
}, SpinnerContainer);

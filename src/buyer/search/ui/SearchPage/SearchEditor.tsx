import { Suspense } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx/Tx";
import type { MarkSuspense } from "@/lib/client/type";
import { FeedEditor } from "~/buyer/feed/ui/FeedEditor/FeedEditor";
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
			data-ui={"SearchEditor"}
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
								_suspense={"I know"}
								feedId={feedId}
							/>
						</Suspense>

						<SaveAsFeedButton
							_suspense={"I know"}
							feedId={feedId}
						/>

						<ResetButton feedId={feedId} />
					</Group>
				</Container>
			</FeedEditor>
		</Container>
	);
}, SpinnerContainer);

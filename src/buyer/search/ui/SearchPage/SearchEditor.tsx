import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
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
			data-ui={"SearchEditor[Container]"}
			data-ui-height="full"
			{...props}
		>
			<FeedEditor
				_suspense={"I know"}
				feedId={feedId}
				hidden={hidden}
			>
				<Container
					data-ui={"SearchEditor-[Container.actions]"}
					data-ui-flow="vertical"
					data-ui-gap="default"
				>
					<Group>
						<SearchButton
							_suspense={"I know"}
							feedId={feedId}
						/>
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

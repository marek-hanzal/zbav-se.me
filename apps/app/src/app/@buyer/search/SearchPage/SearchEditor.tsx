import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { Suspense, type FC } from "react";
import { FeedEditor } from "~/app/@buyer/feed/~public/FeedEditor";
import { ResetButton } from "./ResetButton";
import { SaveAsFeedButton } from "./SaveAsFeedButton";
import { SearchButton } from "./SearchButton/SearchButton";

const hidden = [
	"header",
] as const;

export namespace SearchEditor {
	export interface Props extends Container.Props {
		feedId: string;
	}
}

export const SearchEditor: FC<SearchEditor.Props> = ({ feedId, ui, ...props }) => {
	return (
		<Container
			data-ui={"SearchEditor[Container]"}
			ui={{
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Suspense fallback={<FeedEditor.Fallback />}>
				<FeedEditor
					_suspense={"I know"}
					feedId={feedId}
					hidden={hidden}
				>
					<Container
						data-ui={"SearchEditor-[Container.actions]"}
						ui={{
							flow: "vertical",
							gap: "default",
						}}
					>
						<Group>
							<Suspense fallback={<SearchButton.Fallback feedId={feedId} />}>
								<SearchButton
									_suspense={"I know"}
									feedId={feedId}
								/>
							</Suspense>
							<SaveAsFeedButton feedId={feedId} />
							<ResetButton feedId={feedId} />
						</Group>
					</Container>
				</FeedEditor>
			</Suspense>
		</Container>
	);
};

import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { FeedEditor } from "~/app/@buyer/feed/~public/FeedEditor";
import { ResetButton } from "./ResetButton";
import { SaveAsFeedButton } from "./SaveAsFeedButton";
import { SearchButton } from "./SearchButton";

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
			<FeedEditor feedId={feedId}>
				<Container
					data-ui={"SearchEditor-[Container.actions]"}
					ui={{
						flow: "vertical",
						gap: "default",
					}}
				>
					<SearchButton feedId={feedId} />
					<SaveAsFeedButton feedId={feedId} />
					<ResetButton feedId={feedId} />
				</Container>
			</FeedEditor>
		</Container>
	);
};

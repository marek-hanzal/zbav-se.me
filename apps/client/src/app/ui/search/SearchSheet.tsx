import type { UseQueryResult } from "@tanstack/react-query";
import { Badge, Data, Fulltext, Sheet, Status, Tx } from "@use-pico/client";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";

export namespace SearchSheet {
	export interface Props {
		state: Fulltext.State;
		query: UseQueryResult<any[], Error>;
		textTitle?: string;
		textMessage?: string;
		textNotFound?: ReactNode;
		textPlaceholder?: string;
	}
}

export const SearchSheet: FC<SearchSheet.Props> = ({
	state,
	query,
	textTitle = "Search (title)",
	textMessage,
	textNotFound = <Tx label={"Nothing found (badge)"} />,
	textPlaceholder,
}) => {
	const fulltextRef = useRef<HTMLInputElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Listening for value changes
	useEffect(() => {
		fulltextRef.current?.blur();
	}, [
		state.value,
	]);

	return (
		<Sheet>
			
		</Sheet>
	);
};

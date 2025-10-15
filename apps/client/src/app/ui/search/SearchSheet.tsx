import type { UseQueryResult } from "@tanstack/react-query";
import { Badge, Data, Fulltext, Sheet, Status, Tx } from "@use-pico/client";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";

export namespace SearchSheet {
	export interface Props {
		state: Fulltext.State;
		query: UseQueryResult<any[], Error>;
		textTitle?: ReactNode;
		textNotFound?: ReactNode;
		textPlaceholder?: string;
	}
}

export const SearchSheet: FC<SearchSheet.Props> = ({
	state,
	query,
	textTitle = <Tx label={"Search (title)"} />,
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
			<Status
				icon={SearchIcon}
				textTitle={textTitle}
				tweak={{
					slot: {
						body: {
							class: [
								"flex",
								"flex-col",
								"gap-2",
								"items-center",
								"w-full",
								"px-8",
							],
						},
					},
				}}
			>
				<Fulltext
					ref={fulltextRef}
					state={state}
					textPlaceholder={textPlaceholder}
				/>

				<Data
					result={query}
					renderSuccess={({ data }) => {
						return (
							<Badge
								size={"xl"}
								tone={"secondary"}
								theme={"light"}
								tweak={{
									slot: {
										root: {
											class: [
												"transition-opacity",
												data.length > 0
													? [
															"opacity-0",
														]
													: undefined,
											],
										},
									},
								}}
							>
								{textNotFound}
							</Badge>
						);
					}}
				/>
			</Status>
		</Sheet>
	);
};

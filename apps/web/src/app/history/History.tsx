import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withGithubHistoryQuery } from "@zbav-se.me/sdk/query/public";
import { useId } from "react";
import { HistoryItem } from "~/app/history/HistoryItem";

const DEFAULT_PALETTE = [
	"bg-white",
	"bg-pink-50",
	"bg-pink-100",
	"bg-pink-200",
	"bg-pink-300",
	"bg-pink-400",
	"bg-pink-500",
	"bg-pink-600",
	"bg-pink-700",
	"bg-pink-800",
	"bg-pink-900",
	// special: >10 commits
	"bg-pink-900 ring-1 ring-amber-400",
] as const;

export namespace History {
	export interface Props extends Container.Props {
		//
	}
}

export const History = ({ ui, className, ...props }: History.Props) => {
	const historyRootId = useId();

	return (
		<withGithubHistoryQuery.Suspense
			data={undefined}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<Container
						data-ui="History[Container]"
						ui={{
							layout: "vertical-flex",
							gap: "md",
							...ui,
						}}
						className={className}
						{...props}
					>
						{data.map((item) => (
							<HistoryItem
								key={`${historyRootId}-${item.date}`}
								item={item}
								palette={DEFAULT_PALETTE}
							/>
						))}
					</Container>
				);
			}}
		</withGithubHistoryQuery.Suspense>
	);
};

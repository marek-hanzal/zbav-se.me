import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { withGithubHistoryQuery } from "@zbav-se.me/sdk/query/public";
import { useId } from "react";
import { HistoryItem } from "~/app/history/HistoryItem";

const DEFAULT_PALETTE = [
	"bg-slate-50",
	// Light -> dark across hues (so higher counts generally mean darker tone)
	"bg-rose-50",
	"bg-pink-50",
	"bg-fuchsia-50",
	"bg-purple-50",
	"bg-violet-50",
	//
	"bg-rose-100",
	"bg-pink-100",
	"bg-fuchsia-100",
	"bg-purple-100",
	"bg-violet-100",
	//
	"bg-rose-200",
	"bg-pink-200",
	"bg-fuchsia-200",
	"bg-purple-200",
	"bg-violet-200",
	//
	"bg-rose-300",
	"bg-pink-300",
	"bg-fuchsia-300",
	"bg-purple-300",
	"bg-violet-300",
	//
	"bg-rose-400",
	"bg-pink-400",
	"bg-fuchsia-400",
	"bg-purple-400",
	"bg-violet-400",
	//
	"bg-rose-500",
	"bg-pink-500",
	"bg-fuchsia-500",
	"bg-purple-500",
	"bg-violet-500",
	//
	"bg-rose-600",
	"bg-pink-600",
	"bg-fuchsia-600",
	"bg-purple-600",
	"bg-violet-600",
	//
	"bg-rose-700",
	"bg-pink-700",
	"bg-fuchsia-700",
	"bg-purple-700",
	"bg-violet-700",
	//
	"bg-rose-800",
	"bg-pink-800",
	"bg-fuchsia-800",
	"bg-purple-800",
	"bg-violet-800",
	//
	"bg-rose-900",
	"bg-pink-900",
	"bg-fuchsia-900",
	"bg-purple-900",
	"bg-violet-900",
	// Special - maxed
	"bg-amber-400",
] as const;

export namespace History {
	export interface Props extends Container.Props {
		//
	}
}

export const History = ({ ui, className, ...props }: History.Props) => {
	const historyRootId = useId();
	const threshold = 4;

	return (
		<withGithubHistoryQuery.Suspense
			data={undefined}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<Container
						ui={{
							layout: "vertical-centered",
							height: "full",
							gap: "default",
							...ui,
						}}
						className={className}
						{...props}
					>
						<Container
							data-ui="History[Container]"
							className={[
								"grid grid-flow-row grid-cols-7",
								// Sizing and spacing
								"gap-1",
								// Optional: keep it from stretching weirdly
								"w-fit",
								"h-fit",
							]}
						>
							{[
								...data,
							]
								.reverse()
								.map((item) => (
									<HistoryItem
										key={`${historyRootId}-${item.date}`}
										item={item}
										palette={DEFAULT_PALETTE}
										threshold={threshold}
									/>
								))}
						</Container>

						<Tx
							label={"History activity (hint)"}
							ui={{
								text: "sm",
								color: "icon",
								opacity: "medium",
								inner: "2xl",
							}}
							className={"text-center"}
						/>
					</Container>
				);
			}}
		</withGithubHistoryQuery.Suspense>
	);
};

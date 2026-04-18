import { type FC, useId } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withGithubHistoryQuery } from "~/public/history/query/withGithubHistoryQuery";
import { HistoryItem } from "~/public/ui/HistoryItem";

const DEFAULT_PALETTE = [
	"bg-slate-50 text-slate-900 border-slate-100",
	// Light -> dark across hues (so higher counts generally mean darker tone)
	"bg-rose-50 text-rose-900 border-rose-100",
	"bg-pink-50 text-pink-900 border-pink-100",
	"bg-fuchsia-50 text-fuchsia-900 border-fuchsia-100",
	"bg-purple-50 text-purple-900 border-purple-100",
	"bg-violet-50 text-violet-900 border-violet-100",
	//
	"bg-rose-100 text-rose-900 border-rose-200",
	"bg-pink-100 text-pink-900 border-pink-200",
	"bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200",
	"bg-purple-100 text-purple-900 border-purple-200",
	"bg-violet-100 text-violet-900 border-violet-200",
	//
	"bg-rose-200 text-rose-900 border-rose-300",
	"bg-pink-200 text-pink-900 border-pink-300",
	"bg-fuchsia-200 text-fuchsia-900 border-fuchsia-300",
	"bg-purple-200 text-purple-900 border-purple-300",
	"bg-violet-200 text-violet-900 border-violet-300",
	//
	"bg-rose-300 text-rose-900 border-rose-400",
	"bg-pink-300 text-pink-900 border-pink-400",
	"bg-fuchsia-300 text-fuchsia-900 border-fuchsia-400",
	"bg-purple-300 text-purple-900 border-purple-400",
	"bg-violet-300 text-violet-900 border-violet-400",
	//
	"bg-rose-400 text-rose-50 border-rose-500",
	"bg-pink-400 text-pink-50 border-pink-500",
	"bg-fuchsia-400 text-fuchsia-50 border-fuchsia-500",
	"bg-purple-400 text-purple-50 border-purple-500",
	"bg-violet-400 text-violet-50 border-violet-500",
	//
	"bg-rose-500 text-rose-50 border-rose-600",
	"bg-pink-500 text-pink-50 border-pink-600",
	"bg-fuchsia-500 text-fuchsia-50 border-fuchsia-600",
	"bg-purple-500 text-purple-50 border-purple-600",
	"bg-violet-500 text-violet-50 border-violet-600",
	//
	"bg-rose-600 text-rose-50 border-rose-500",
	"bg-pink-600 text-pink-50 border-pink-500",
	"bg-fuchsia-600 text-fuchsia-50 border-fuchsia-500",
	"bg-purple-600 text-purple-50 border-purple-500",
	"bg-violet-600 text-violet-50 border-violet-500",
	//
	"bg-rose-700 text-rose-50 border-rose-600",
	"bg-pink-700 text-pink-50 border-pink-600",
	"bg-fuchsia-700 text-fuchsia-50 border-fuchsia-600",
	"bg-purple-700 text-purple-50 border-purple-600",
	"bg-violet-700 text-violet-50 border-violet-600",
	//
	"bg-rose-800 text-rose-50 border-rose-700",
	"bg-pink-800 text-pink-50 border-pink-700",
	"bg-fuchsia-800 text-fuchsia-50 border-fuchsia-700",
	"bg-purple-800 text-purple-50 border-purple-700",
	"bg-violet-800 text-violet-50 border-violet-700",
	//
	"bg-rose-900 text-rose-50 border-rose-800",
	"bg-pink-900 text-pink-50 border-pink-800",
	"bg-fuchsia-900 text-fuchsia-50 border-fuchsia-800",
	"bg-purple-900 text-purple-50 border-purple-800",
	"bg-violet-900 text-violet-50 border-violet-800",
	// Special - maxed
	"bg-amber-400 text-amber-900 border-amber-500",
] as const;

export namespace History {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const History: FC<History.Props> = ({ _suspense, className, ...props }) => {
	const historyRootId = useId();
	const threshold = 4;
	const weeks = 8;
	const { data } = withGithubHistoryQuery.useSuspenseQuery({
		weeks,
	});

	return (
		<Container
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-gap="default"
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
					/**
					 * We're reversing, so we've to prevent mutation of the original data source.
					 */
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
				data-ui-text="sm"
				data-ui-color="icon"
				data-ui-opacity="6"
				data-ui-inner="2xl"
				className={"text-center"}
			/>
		</Container>
	);
};

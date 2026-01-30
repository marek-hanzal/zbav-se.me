import { Container } from "@use-pico/client/ui/container";
import type { tBoardItemItem } from "@zbav-se.me/sdk/api/arkini";
import { type FC, useRef } from "react";
import { BoardItem } from "~/app/board/BoardItem";

export namespace Board {
	export interface Props extends Container.Props {
		/** cols */
		width: number;
		/** rows */
		height: number;
		items: tBoardItemItem[];
	}
}

export const Board: FC<Board.Props> = ({ ui, className, width, height, items, ...props }) => {
	const constraintsRef = useRef<HTMLDivElement | null>(null);

	return (
		<Container
			data-ui={"Board[Container]"}
			ui={{
				flow: "vertical",
				justify: "center",
				items: "center",
				height: "full",
				width: "full",
				...ui,
			}}
			className={[
				"bg-violet-950/40",
				className,
			]}
			{...props}
		>
			<Container
				data-ui={"Board[Wrapper]"}
				className={[
					"relative",
					"w-full",
				]}
				style={{
					aspectRatio: `${width} / ${height}`,
				}}
			>
				<div
					data-ui={"Board[Canvas]"}
					aria-hidden
					className={[
						"absolute inset-0 overflow-hidden",
						"rounded-2xl border border-white/10 bg-violet-900/40",
						"pointer-events-none select-none",
					].join(" ")}
					style={{
						backgroundImage: `
							linear-gradient(rgba(255,140,255,0.12) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
						`,
						backgroundSize: `calc(100% / ${width}) calc(100% / ${height})`,
						backgroundPosition: "0 0",
					}}
				/>

				<div
					ref={constraintsRef}
					data-ui={"Board[Items]"}
					className="absolute inset-0"
				>
					{items.map((item) => (
						<withBoardItemQuery.Suspense>
                            {({ data: item }) => (
                                <BoardItem
                                    key={item.id}
                                    constraintsRef={constraintsRef}
                                    item={item}
                                    cols={width}
                                    rows={height}
                                />
                            )}
                        </withBoardItemQuery.Suspense>
					))}
				</div>
			</Container>
		</Container>
	);
};

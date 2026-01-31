import { Container } from "@use-pico/client/ui/container";
import { type FC, useLayoutEffect, useRef, useState } from "react";
import { BoardItem } from "~/app/board/BoardItem";
import { useBoardStore } from "~/app/board/useBoardStore";
import { createLayout } from "~/app/motion/engine/createLayout";
import type { Motion } from "~/app/motion/Motion";

export namespace Board {
	export interface Props extends Container.Props {
		/** cols */
		width: number;
		/** rows */
		height: number;
	}
}

export const Board: FC<Board.Props> = ({ ui, className, width, height, ...props }) => {
	const boardRef = useRef<HTMLDivElement | null>(null);
	const items = useBoardStore((state) => state.items);
	const [layout, setLayout] = useState<Motion.Layout | null>(null);

	useLayoutEffect(() => {
		const el = boardRef.current;
		if (!el) {
			return;
		}

		const recalc = () => {
			const rect = el.getBoundingClientRect();
			setLayout(
				createLayout({
					rect,
					width,
					height,
				}),
			);
		};

		recalc();

		const ro = new ResizeObserver(() => {
			recalc();
		});
		ro.observe(el);

		return () => {
			ro.disconnect();
		};
	}, [
		width,
		height,
	]);

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
					ref={boardRef}
					data-ui={"Board[Items]"}
					className="absolute inset-0"
				>
					{layout
						? items.map((item) => (
								<BoardItem
									key={item.id}
									boardRef={boardRef}
									item={item}
									layout={layout}
								/>
							))
						: null}
				</div>
			</Container>
		</Container>
	);
};

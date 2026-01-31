import { Container } from "@use-pico/client/ui/container";
import type { AnimationPlaybackControlsWithThen } from "motion/react";
import { type FC, useCallback, useLayoutEffect, useRef } from "react";
import { BoardItem } from "~/app/board/BoardItem";
import { useBoardStore } from "~/app/board/useBoardStore";
import { createLayout } from "~/app/motion/createLayout";
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
	//
	const items = useBoardStore((state) => state.items);
	const patch = useBoardStore((state) => state.patch);
	//
	const itemsRef = useRef(items);
	itemsRef.current = items;

	const dimsRef = useRef({
		width,
		height,
	});
	dimsRef.current = {
		width,
		height,
	};

	const activeLayoutRef = useRef<Motion.Layout | null>(null);
	const animsByIdRef = useRef<Map<string, Set<AnimationPlaybackControlsWithThen>>>(new Map());
	const nodesByIdRef = useRef<Map<string, Motion.RenderNode>>(new Map());

	const registerAnim = useCallback((id: string, anim: AnimationPlaybackControlsWithThen) => {
		let set = animsByIdRef.current.get(id);
		if (!set) {
			set = new Set();
			animsByIdRef.current.set(id, set);
		}
		set.add(anim);

		anim.finished.finally(() => {
			const set = animsByIdRef.current.get(id);
			if (!set) {
				return;
			}
			set.delete(anim);
			if (set.size === 0) {
				animsByIdRef.current.delete(id);
			}
		});
	}, []);
	const stopAnim = useCallback((id: string) => {
		const set = animsByIdRef.current.get(id);
		if (!set) {
			return;
		}
		for (const anim of set) {
			anim.stop();
		}
		animsByIdRef.current.delete(id);
	}, []);

	const getLayoutSnapshot = (): Motion.Layout | null => {
		const el = boardRef.current;
		if (!el) {
			return null;
		}
		return createLayout({
			rect: el.getBoundingClientRect(),
			width: dimsRef.current.width,
			height: dimsRef.current.height,
		});
	};

	useLayoutEffect(() => {
		if (!boardRef.current) {
			return;
		}

		const rect = boardRef.current.getBoundingClientRect();
		layoutRef.current = createLayout({
			rect,
			width,
			height,
		});
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
					{items.map((item) => (
						<BoardItem
							key={item.id}
							boardRef={boardRef}
							item={item}
							cols={width}
							rows={height}
						/>
					))}
				</div>
			</Container>
		</Container>
	);
};

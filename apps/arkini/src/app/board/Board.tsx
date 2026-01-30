import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { useBoardContext } from "~/app/board/useBoardContext";

export namespace Board {
	export interface Props extends Container.Props {
		/** cols */
		width: number;
		/** rows */
		height: number;
	}
}

export const Board: FC<Board.Props> = ({ ui, className, width, height, ...props }) => {
	const useBoardStore = useBoardContext();
	const items = useBoardStore((state) => state.items);

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
				data-ui={"Board[Canvas]"}
				aria-hidden
				className={[
					"relative w-full overflow-hidden",
					"rounded-2xl border border-white/10 bg-violet-900/40",
					"pointer-events-none select-none",
				]}
				style={{
					aspectRatio: `${width} / ${height}`,
					backgroundImage: `
						linear-gradient(rgba(255,140,255,0.12) 1px, transparent 1px),
						linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
					`,
					backgroundSize: `calc(100% / ${width}) calc(100% / ${height})`,
					backgroundPosition: "0 0",
				}}
			/>
		</Container>
	);
};

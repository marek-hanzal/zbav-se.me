import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC, ReactNode, Ref } from "react";

export namespace Title {
	export interface Props extends Container.Props {
		ref?: Ref<HTMLDivElement>;
		textTitle: string;
		textSubtitle?: string;
		right?: ReactNode;
		left?: ReactNode;
	}
}

export const Title: FC<Title.Props> = ({
	ref,
	textTitle,
	textSubtitle,
	right,
	left,
	...props
}) => {
	return (
		<Container
			ui="Title-root"
			round={"lg"}
			square={"md"}
			tweak={{
				slot: {
					root: {
						class: [
							"inline-flex",
							"items-center",
							"justify-between",
							"gap-xs",
						],
					},
				},
			}}
			{...props}
		>
			<div
				data-ui="Title-title"
				className="inline-flex flex-col gap-0 items-start justify-center"
			>
				<div className="inline-flex flex-row gap-1 items-center justify-center">
					{left ? (
						<div className="flex flex-row items-center justify-center">
							{left}
						</div>
					) : null}
					<Tx
						label={textTitle}
						font={"bold"}
						size={"xl"}
					/>
				</div>

				{textSubtitle ? (
					<Tx
						label={textSubtitle}
						size={"sm"}
					/>
				) : null}
			</div>

			{right ? (
				<div
					data-ui="Title-right"
					className="inline-flex flex-row gap-1 items-end justify-center max-w-[50%]"
				>
					{right}
				</div>
			) : null}
		</Container>
	);
};

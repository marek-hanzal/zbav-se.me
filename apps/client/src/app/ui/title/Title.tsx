import { Container, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
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
				className={tvc(
					"inline-flex",
					"flex-row",
					"gap-1",
					"justify-start",
					textSubtitle ? "items-start" : "items-center",
				)}
			>
				{left}
				<div className="inline-flex flex-col gap-0 items-start justify-center">
					<Tx
						label={textTitle}
						font={"bold"}
						size={"xl"}
					/>
					{textSubtitle ? (
						<Tx
							label={textSubtitle}
							size={"sm"}
						/>
					) : null}
				</div>
			</div>

			{right ? (
				<div className="inline-flex flex-row gap-1 items-end justify-center max-w-[50%]">
					{right}
				</div>
			) : null}
		</Container>
	);
};

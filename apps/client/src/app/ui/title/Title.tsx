import { Container, type Icon, Tx } from "@use-pico/client";
import type { FC, ReactNode, Ref } from "react";

export namespace Title {
	export interface Props extends Container.Props {
		ref?: Ref<HTMLDivElement>;
		textTitle: string;
		right?: ReactNode;
		icon?: Icon.Type;
		iconProps?: Icon.Props;
	}
}

export const Title: FC<Title.Props> = ({
	ref,
	textTitle,
	right,
	icon,
	iconProps,
	...props
}) => {
	return (
		<Container
			tone={"primary"}
			theme={"light"}
			round={"lg"}
			square={"md"}
			border={"default"}
			shadow={"default"}
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
			<Tx
				label={textTitle}
				font={"bold"}
				size={"xl"}
			/>

			{right ? (
				<div className="inline-flex flex-row gap-1 items-end justify-center max-w-[50%]">
					{right}
				</div>
			) : null}
		</Container>
	);
};

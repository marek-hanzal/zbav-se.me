import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import type { FC, ReactNode } from "react";
import { ThemeCls } from "../cls";

export namespace Title {
	export interface Props extends Container.Props {
		textTitle: string;
		textSubtitle?: string;
		right?: ReactNode;
		left?: ReactNode;
	}
}

export const Title: FC<Title.Props> = ({ textTitle, textSubtitle, right, left, ...props }) => {
	return (
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone: "primary",
				theme: "light",
			}}
		>
			<Container
				ui="Title-root"
				round={"lg"}
				tone={"unset"}
				theme={"unset"}
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
					className="inline-flex flex-col gap-0 items-start justify-center min-w-0"
				>
					<div className="inline-flex flex-row gap-2 items-center justify-center min-w-0 max-w-full">
						{left ? (
							<div className="flex flex-row items-center justify-center">{left}</div>
						) : null}
						<Tx
							label={textTitle}
							font={"bold"}
							size={"xl"}
							truncate
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
		</VariantProvider>
	);
};

import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { FC, ReactNode } from "react";
import { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";
import { Image } from "./Image";

export namespace ListItem {
	export type Hero = UploadSchema.Type | ReactNode | undefined | null;

	export interface Props extends Omit<Group.Props, "title"> {
		hero: Hero;
		title: ReactNode;
		bottom: ReactNode;
	}

	export type PropsEx = Partial<Props>;
}

export const ListItem: FC<ListItem.Props> = ({
	hero,
	title,
	bottom,
	ui,
	className,
	children,
	...props
}) => {
	const upload = UploadSchema.safeParse(hero);
	const image: ReactNode =
		hero == null ? (
			<Image />
		) : upload.success ? (
			<Image src={upload.data.url} />
		) : (
			<Container
				className={"aspect-square h-full shrink-0 overflow-hidden"}
				ui={{
					tone: "subtle",
					theme: "light",
					round: "md",
					height: "full",
					flow: "horizontal",
					items: "center",
					justify: "center",
					background: "default",
				}}
			>
				{hero as ReactNode}
			</Container>
		);

	return (
		<Group
			data-ui={"ListItem"}
			className={[
				"min-h-26",
				"h-26",
				"md:h-28",
				"shrink-0",
				"relative",
				className,
			]}
			ui={{
				tone: "neutral",
				theme: "light",
				width: "full",
				background: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					flow: "horizontal",
					position: "relative",
					height: "full",
					width: "full",
				}}
			>
				{image}

				<Container
					className={"min-w-0 flex-1"}
					ui={{
						flow: "vertical",
						items: "start",
						justify: "space-between",
						height: "full",
						inner: "xs",
						width: "full",
					}}
				>
					{title}

					{bottom}
				</Container>

				<Icon
					icon={ChevronRightIcon}
					ui={{
						tone: "neutral",
						theme: "light",
						snapTo: "right-center",
						text: "xl",
						color: "lead",
					}}
				/>

				{children}
			</Container>
		</Group>
	);
};

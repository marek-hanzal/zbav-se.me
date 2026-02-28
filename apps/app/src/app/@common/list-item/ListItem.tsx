import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import type { FC, ReactNode } from "react";
import { Image } from "./Image";

export namespace ListItem {
	export interface Props extends Omit<Group.Props, "title"> {
		hero: tUpload | undefined;
		title: ReactNode;
		bottom: ReactNode;
	}
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
	return (
		<Group
			data-ui={"ListItem[Group]"}
			className={[
				"min-h-24",
				"h-24",
				"md:h-28",
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
				<Image src={hero?.url} />

				<Container
					className={"min-w-0 flex-1"}
					ui={{
						flow: "vertical",
						items: "start",
						justify: "space-between",
						height: "full",
						inner: "xs",
					}}
				>
					{title}

					{bottom}
				</Container>

				<Icon
					icon={ArrowRightIcon}
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

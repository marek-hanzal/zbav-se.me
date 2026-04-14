import { createServerFn } from "@tanstack/react-start";
import { createCompositeComponent } from "@tanstack/react-start/rsc";
import type { ReactNode } from "react";
import { Container } from "@/lib/client/container";
import { UserIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export namespace UserProfileFn {
	export interface Props {
		signOutButton(): ReactNode;
	}
}

export const UserProfileFn = createServerFn()
	.middleware([
		withUserMiddleware,
	])
	.handler(async ({ context: { user } }) => {
		return createCompositeComponent((props: UserProfileFn.Props) => (
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					icon={UserIcon}
					textTitle={user.email}
					textMessage={user.name}
					action={props.signOutButton()}
					ui={{
						tone: "brand",
						theme: "light",
						color: "lead",
						text: "3xl",
					}}
				/>
			</Container>
		));
	});

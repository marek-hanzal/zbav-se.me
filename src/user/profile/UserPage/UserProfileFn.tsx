import { createServerFn } from "@tanstack/react-start";
import { createCompositeComponent } from "@tanstack/react-start/rsc";
import type { ReactNode } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { UserIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import { LabelValue } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translator";
import { withLocaleMiddleware } from "~/server/middleware/withLocaleMiddleware";
import { withTranslationMiddleware } from "~/server/middleware/withTranslationMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { agentUsageCollectionFn } from "~/user/agent/fn/agentUsageCollectionFn";

export namespace UserProfileFn {
	export interface Props {
		signOutButton(): ReactNode;
	}
}

export const UserProfileFn = createServerFn()
	.middleware([
		withUserMiddleware,
		withLocaleMiddleware,
		withTranslationMiddleware,
	])
	.handler(async ({ context: { user, locale } }) => {
		const usage = await agentUsageCollectionFn({
			data: {},
		});
		const tokens = usage.reduce((prev, acc) => {
			return prev + acc.total;
		}, 0);

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
				>
					<Container
						ui={{
							inner: "4xl",
						}}
					>
						<Group>
							<LabelValue
								textLabel={translator.text("Token usage (label)")}
								textValue={toLocaleNumber({
									locale,
									number: tokens,
								})}
							/>
						</Group>
					</Container>
				</Status>
			</Container>
		));
	});

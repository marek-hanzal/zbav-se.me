import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { AiIcon } from "@/lib/client/icon/AiIcon";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";

export namespace Empty {
	export interface Props {
		check: boolean;
		onSubmit: (value: string) => void;
		isBusy: boolean;
		error?: {
			message: string;
		} | null;
		children?: ReactNode;
	}
}

export const Empty: FC<Empty.Props> = ({ check, onSubmit, isBusy, error, children }) => {
	return (
		<EmptyState
			check={[
				{
					check() {
						return check;
					},
					render() {
						return (
							<Container
								ui={{
									layout: "vertical-centered",
									height: "full",
									width: "full",
								}}
							>
								<Status
									icon={AiIcon}
									textTitle={translator.text("Assistant welcome (title)")}
									textMessage={translator.text("Assistant welcome (message)")}
									action={
										<ChatInput
											onSubmit={onSubmit}
											placeholder={translator.text("Write to a assistant")}
											loading={isBusy}
											ui={{
												width: "full",
											}}
										/>
									}
								/>
							</Container>
						);
					},
				},
			]}
		>
			<ol className="space-y-3">
				{children}

				{isBusy ? (
					<li className="flex justify-start">
						<SpinnerContainer />
					</li>
				) : null}

				{error ? (
					<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
						{error.message}
					</div>
				) : null}
			</ol>
		</EmptyState>
	);
};

import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import type { FC, ReactNode } from "react";
import { theme } from "../theme/theme";

export namespace MailLayout {
	export interface Props {
		children: ReactNode;
		preview: string;
		title: string;
		lead?: string;
		footer?: string;
	}
}

export const MailLayout: FC<MailLayout.Props> = ({ children, preview, title, lead, footer }) => {
	return (
		<Html>
			<Head />
			<Preview>{preview}</Preview>
			<Tailwind config={theme.tailwind}>
				<Body
					className={"m-0 bg-slate-50 px-4 py-8 font-sans"}
					style={{
						backgroundColor: theme.colors.canvas,
						color: theme.colors.text,
					}}
				>
					<Container
						className={
							"mx-auto max-w-xl rounded-4xl border border-brand-100 bg-white px-8 py-10 shadow-card"
						}
						style={{
							backgroundColor: theme.colors.card,
							borderColor: theme.colors.cardBorder,
							boxShadow: `0 20px 45px ${theme.colors.cardShadow}`,
						}}
					>
						<Section className={"mb-8"}>
							<Text
								className={
									"m-0 text-xs font-bold uppercase tracking-[0.24em] text-brand-700"
								}
							>
								zbav-se.me
							</Text>
							<Heading
								as={"h1"}
								className={
									"m-0 mt-4 text-[28px] leading-8 font-bold text-slate-950"
								}
								style={{
									color: theme.colors.text,
								}}
							>
								{title}
							</Heading>
							{lead ? (
								<Text
									className={"m-0 mt-4 text-base leading-7 text-slate-600"}
									style={{
										color: theme.colors.textMuted,
									}}
								>
									{lead}
								</Text>
							) : null}
						</Section>

						<Section>{children}</Section>

						<Hr className={"my-8 border-slate-200"} />

						<Text
							className={"m-0 text-sm leading-6 text-slate-500"}
							style={{
								color: theme.colors.textSoft,
							}}
						>
							{footer ?? "Transactional email from zbav-se.me."}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

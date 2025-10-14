import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";

/**
 * Mobile-first landing with full-screen snapping sections (Snapper + Sheet).
 * Colors aim to stay in the pink/purple family shown in screenshots.
 * GSAP is used for subtle enter animations per section.
 */

// Small helper to animate a section when it mounts
function useEnterAnim(ref: React.RefObject<HTMLElement>, delay = 0) {
	useLayoutEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				el,
				{
					autoAlpha: 0,
					y: 24,
				},
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
					delay,
				},
			);
		}, el);
		return () => ctx.revert();
	}, [
		ref,
		delay,
	]);
}

// Typography helpers
const titleCls = tvc([
	"text-2xl",
	"font-semibold",
	"tracking-tight",
	"text-rose-700",
	"text-center",
]);

const subtitleCls = tvc([
	"text-base",
	"text-center",
	"text-fuchsia-700",
	"opacity-90",
]);

const bodyCls = tvc([
	"text-sm",
	"leading-relaxed",
	"text-rose-900/80",
]);

function SectionShell({
	children,
	tone = "",
}: {
	children: React.ReactNode;
	tone?: "" | "alt";
}) {
	const ref = useRef<HTMLElement>(null);
	useEnterAnim(ref);

	return (
		<Sheet
			className={tvc([
				"h-[100dvh]",
				"snap-start",
				// Soft backgrounds to match the provided palette
				tone === "alt" ? "bg-rose-50" : "bg-pink-50",
				"px-4",
				"py-8",
				"flex",
				"items-center",
			])}
		>
			<section
				ref={ref}
				className={tvc([
					"w-full",
					"max-w-screen-sm",
					"mx-auto",
				])}
			>
				{children}
			</section>
		</Sheet>
	);
}

function Hero({ locale }: { locale: string }) {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.05);

	return (
		<Sheet
			className={tvc([
				"h-[100dvh]",
				"snap-start",
				"bg-pink-50",
			])}
		>
			<Status
				icon={<Logo />}
				textTitle={<Tx label={"zbav-se.me"} />}
				textSubtitle={<Tx label={"Prostě to pošli dál…"} />}
				tweak={{
					slot: {
						title: {
							class: [
								"text-4xl",
								"text-rose-700",
								"font-extrabold",
							],
						},
						subtitle: {
							class: [
								"text-fuchsia-700",
								"text-lg",
								"mt-2",
							],
						},
						body: {
							class: [
								"w-full",
								"mt-6",
							],
						},
					},
				}}
			>
				<div
					ref={ref}
					className={tvc([
						"w-full",
						"inline-flex",
						"justify-center",
						"gap-3",
					])}
				>
					<Button
						tone={"secondary"}
						theme={"dark"}
					>
						<LinkTo
							to={"/$locale/login"}
							params={{
								locale,
							}}
						>
							<Tx label={"Login"} />
						</LinkTo>
					</Button>
					<Button
						tone={"primary"}
						theme={"dark"}
					>
						<LinkTo
							to={"/$locale/register"}
							params={{
								locale,
							}}
						>
							<Tx label={"Registrace"} />
						</LinkTo>
					</Button>
				</div>
			</Status>
		</Sheet>
	);
}

function WhatWeAre() {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.1);

	return (
		<SectionShell tone="alt">
			<div
				ref={ref}
				className={tvc([
					"space-y-3",
				])}
			>
				<h2 className={titleCls}>
					<Tx label={"Co jsme zač"} />
				</h2>
				<p className={bodyCls}>
					<Tx
						label={
							"Komunitní tržiště pro rychlý pohyb věcí. Bez zbytečných okolků — vyfoť, pošli dál a je to."
						}
					/>
				</p>
				<ul
					className={tvc([
						"mt-2",
						"space-y-2",
					])}
				>
					<li className={bodyCls}>
						✅ <Tx label={"Místní nabídky a jasná komunikace"} />
					</li>
					<li className={bodyCls}>
						✅{" "}
						<Tx
							label={
								"Bez složitého inzerování — pár klepnutí a hotovo"
							}
						/>
					</li>
					<li className={bodyCls}>
						✅ <Tx label={"Důraz na rychlost a férovost"} />
					</li>
				</ul>
			</div>
		</SectionShell>
	);
}

function HowItWorks() {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.1);

	const item = (n: number, title: string, text: string) => (
		<li
			className={tvc([
				"flex",
				"gap-3",
			])}
		>
			<div
				className={tvc([
					"flex-none",
					"h-8",
					"w-8",
					"rounded-full",
					"bg-fuchsia-600/10",
					"border",
					"border-fuchsia-600/20",
					"grid",
					"place-items-center",
					"text-fuchsia-700",
					"font-semibold",
				])}
			>
				{n}
			</div>
			<div>
				<div
					className={tvc([
						"font-medium",
						"text-rose-800",
					])}
				>
					{title}
				</div>
				<div className={bodyCls}>{text}</div>
			</div>
		</li>
	);

	return (
		<SectionShell>
			<div
				ref={ref}
				className={tvc([
					"space-y-4",
				])}
			>
				<h2 className={titleCls}>
					<Tx label={"Jak to funguje"} />
				</h2>
				<ul
					className={tvc([
						"space-y-4",
					])}
				>
					{item(
						1,
						"Vyfoť a napiš cenu",
						"Krátký popis, pár fotek, hotovo za minutu.",
					)}
					{item(
						2,
						"Pošli dál",
						"Zveřejníš. Kupující poblíž uvidí hned v feedu.",
					)}
					{item(
						3,
						"Domluva a předání",
						"Chat, domluva místa a rychlé předání bez cirátů.",
					)}
				</ul>
			</div>
		</SectionShell>
	);
}

function Features() {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.1);

	const chip = (t: string) => (
		<div
			className={tvc([
				"px-3",
				"py-2",
				"rounded-xl",
				"bg-white/60",
				"backdrop-blur",
				"border",
				"border-rose-200",
				"text-rose-800",
				"text-sm",
				"shadow-sm",
			])}
		>
			{t}
		</div>
	);

	return (
		<SectionShell tone="alt">
			<div
				ref={ref}
				className={tvc([
					"space-y-4",
				])}
			>
				<h2 className={titleCls}>
					<Tx label={"Proč tohle bude bavit"} />
				</h2>
				<p className={subtitleCls}>
					<Tx label={"Malé detaily, velká rychlost"} />
				</p>
				<div
					className={tvc([
						"grid",
						"grid-cols-2",
						"gap-2",
						"mt-2",
					])}
				>
					{chip("Swipe feed")}
					{chip("Rychlá zpráva")}
					{chip("Fotky z kamery")}
					{chip("Hodnocení profilů")}
					{chip("Notifikace")}
					{chip("Bez balíkovny")}
				</div>
			</div>
		</SectionShell>
	);
}

function Safety() {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.1);
	return (
		<SectionShell>
			<div
				ref={ref}
				className={tvc([
					"space-y-3",
				])}
			>
				<h2 className={titleCls}>
					<Tx label={"Důvěra & bezpečí"} />
				</h2>
				<ul
					className={tvc([
						"space-y-2",
					])}
				>
					<li className={bodyCls}>
						🛡️ <Tx label={"Ověřené e‑maily a zařízení"} />
					</li>
					<li className={bodyCls}>
						🧾 <Tx label={"Historie a hodnocení prodejců"} />
					</li>
					<li className={bodyCls}>
						🚩 <Tx label={"Nahlášení inzerátů a rychlá moderace"} />
					</li>
				</ul>
			</div>
		</SectionShell>
	);
}

function CTA({ locale }: { locale: string }) {
	const ref = useRef<HTMLDivElement>(null);
	useEnterAnim(ref, 0.1);

	return (
		<SectionShell tone="alt">
			<div
				ref={ref}
				className={tvc([
					"space-y-5",
					"text-center",
				])}
			>
				<h2 className={titleCls}>
					<Tx label={"Jdeme na to?"} />
				</h2>
				<p className={subtitleCls}>
					<Tx label={"Vytvoř účet zdarma a pošli první věc dál."} />
				</p>
				<div
					className={tvc([
						"inline-flex",
						"gap-3",
					])}
				>
					<Button
						tone={"secondary"}
						theme={"dark"}
					>
						<LinkTo
							to={"/$locale/register"}
							params={{
								locale,
							}}
						>
							<Tx label={"Začít zdarma"} />
						</LinkTo>
					</Button>
					<Button
						tone={"primary"}
						theme={"dark"}
					>
						<LinkTo
							to={"/$locale/tos"}
							params={{
								locale,
							}}
						>
							<Tx label={"ToS / Více info"} />
						</LinkTo>
					</Button>
				</div>
			</div>
		</SectionShell>
	);
}

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
				className={tvc([
					"bg-pink-50",
				])}
			>
				{/* HERO */}
				<Hero locale={locale} />

				{/* ABOUT */}
				<WhatWeAre />

				{/* HOW */}
				<HowItWorks />

				{/* FEATURES */}
				<Features />

				{/* SAFETY */}
				<Safety />

				{/* CTA */}
				<CTA locale={locale} />
			</Container>
		);
	},
});

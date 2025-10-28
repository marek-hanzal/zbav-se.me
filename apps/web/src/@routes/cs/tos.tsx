import { createFileRoute } from "@tanstack/react-router";
import { Container, Typo } from "@use-pico/client";
import { useCls, VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui";

export const Route = createFileRoute("/cs/tos")({
	component() {
		const { slots } = useCls(ThemeCls);

		return (
			<Container
				layout={"vertical-content"}
				overflow={"vertical"}
				tone={"secondary"}
				theme={"light"}
				square={"md"}
			>
				<Typo
					label={"Podmínky používání služby"}
					preset={"header"}
					text={"center"}
				/>

				<Typo
					label={"zbav-se.me"}
					preset={"subheader"}
					text={"center"}
				/>

				<div
					className={slots.default({
						slot: {
							default: {
								class: [
									"grid",
									"grid-cols-[auto_1fr]",
									"items-baseline",
									"gap-2",
									"w-full",
								],
								token: [
									"border.default",
									"shadow.default",
									"tone.secondary.dark.border",
									"tone.secondary.dark.bg",
									"tone.secondary.dark.shadow",
									"square.md",
								],
							},
						},
					})}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "dark",
						}}
					>
						<Typo
							label={"Účinné od:"}
							size={"sm"}
							italic={true}
							wrap={"nowrap"}
						/>
						<Typo
							label={"12. 10. 2025"}
							font={"bold"}
						/>

						<Typo
							label={"Verze:"}
							size={"sm"}
							italic={true}
							wrap={"nowrap"}
						/>
						<Typo
							label={"1.0-alfa"}
							font={"bold"}
						/>

						<Typo
							label={"Dokument:"}
							size={"sm"}
							italic={true}
							wrap={"nowrap"}
						/>
						<Typo
							label={"Podmínky používání"}
							font={"bold"}
						/>
					</VariantProvider>
				</div>

				{/* Quote */}
				<Typo
					label={
						"Chceme být fér a srozumitelní – tyto podmínky kopírují základní právní závazky a zvyklosti při použití online tržiště. Žádné jiné záludnosti zde nehledejte."
					}
					display={"block"}
					size={"md"}
					text={"center"}
					tone={"neutral"}
					italic={true}
				/>

				{/* Section 1 */}
				<Typo
					label={"1) Kdo jsme"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={"Provozovatel: Marek Hanzal, IČ 87911418"}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				<Typo
					label={"Kontakt: marek.hanzal@icloud.com"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 2 */}
				<Typo
					label={"2) Co děláme"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"zbav-se.me je online služba pro rychlé vytváření a prohlížení inzerátů mezi uživateli (C2C)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				<Typo
					label={
						"Nejsme kupující ani prodávající – poskytujeme pouze prostor a nástroje."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					italic={true}
					tone={"subtle"}
				/>

				{/* Section 3 */}
				<Typo
					label={"3) Stav služby – alfa"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Jsme v rané fázi. Funkce se budou často měnit a rozšiřovat, dokud nedosáhneme stabilního stavu, včetně zpětné vazby od vás jako uživatelů."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"Data mohou být smazána a služba může být dočasně nedostupná. Nedáváme záruku dostupnosti ani zachování obsahu."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
					tone={"warning"}
				/>

				<Typo
					label={
						"Stabilita z hlediska technického zázemí je ovšem velmi vysoká."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 4 */}
				<Typo
					label={"4) Účet, věk a přístup"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={"• K registraci používáme e‑mail a heslo."}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Heslo si chraň a nesdílej ho. Za aktivity na svém účtu odpovídáš ty."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				<Typo
					label={"• Věkové omezení:"}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				<Typo
					label={
						"  - Služba je určena osobám 15+ (v souladu s českým GDPR pro on‑line služby)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"  - Osoby mladší 15 let službu používat nesmí."}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"  - Osoby 15–17 let mohou službu používat jen v rozsahu přiměřeném jejich věku. Vkládání inzerátů a uzavírání kupních smluv (prodej) je vyhrazeno osobám 18+ nebo nezletilým pouze se souhlasem / v zastoupení zákonného zástupce. Můžeme vyžádat ověření věku a do doby ověření omezit funkce."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Z bezpečnostních důvodů můžeme účet dočasně omezit (např. při podezření na zneužití)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 5 */}
				<Typo
					label={"5) Pravidla používání"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Buď slušný člověk a jednej v souladu se zákonem. Konkrétně:"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Smíš nahrávat fotky a popisy k inzerátům a používat službu obvyklým způsobem."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Nesmíš porušovat zákony, cizí práva (autorská, osobnostní), šířit spam, malware, pornografii, nenávist či obsah ohrožující bezpečnost."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				<Typo
					label={
						"• Můžeme odstranit obsah porušující pravidla/zákon a omezit nebo zrušit účet při závažném či opakovaném porušování."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 6 */}
				<Typo
					label={"6) Obsah uživatelů a licence"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={"• Vlastnictví: Fotky a texty zůstávají tvoje."}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Licence pro provoz: Uděluješ nám nevýhradní, celosvětovou a bezplatnou licenci tvůj obsah hostovat, ukládat, kopírovat a zobrazovat v souvislosti s provozem služby (včetně doručování přes CDN). Tuto licenci můžeš ukončit smazáním obsahu; technické kopie mohou krátce přetrvat v cache."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Veřejnost: Fotky u inzerátů jsou veřejně dostupné v rámci aplikace / přes CDN. Zvaž, co nahráváš."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					font={"semi"}
				/>

				{/* Section 7 */}
				<Typo
					label={"7) Infrastruktura a technické zázemí"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={"• Aplikace: primárně hostovaná na platformě Vercel"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Databáze: Neon (PostgreSQL)"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• CDN a fotky: Bunny.net (CDN + úložiště)"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Napovídání adres: Geoapify"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Platby: Stripe"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"Poznámka"}
					display={"block"}
					size={"md"}
					font={"semi"}
					text={"left"}
				/>

				<Typo
					label={
						"Cílíme na Evropu; preferovaným regionem je Frankfurt (DE). Některé části infrastruktury však mohou být dočasně hostované v jiném regionu v Evropě; ve výjimečných případech může být část provozu směrována do USA (např. při výpadku nebo doručování přes CDN). Tyto situace minimalizujeme a při nejbližší příležitosti vracíme zpracování zpět do EU."
					}
					display={"block"}
					size={"md"}
					text={"left"}
					italic={true}
					tone={"subtle"}
				/>

				{/* Section 8 */}
				<Typo
					label={"8) Data účtu a lokality (stručně, bez zásad)"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"• Ukládáme pouze: tvůj e‑mail a heslo (hesla ukládáme tak, aby je nešlo přečíst (ani námi). Neuchováváme je v čitelné podobě)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Lokalita inzerátu je zobecněná; přesnou polohu nebereme – cílem je propojit lidi v rámci města/regionu. Přesné domluvy jsou na uživatelích."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• K doručování obrázků používáme Bunny.net (CDN), kde jsou fotky dostupné přes dlouhé, náhodné odkazy (nejde na ně běžně přijít bez přesného odkazu)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Podrobná pravidla zpracování osobních údajů řeší samostatné Zásady ochrany osobních údajů."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 9 */}
				<Typo
					label={"9) Cookies"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Používáme pouze nezbytné cookies pro přihlášení a běh aplikace. Tato aplikace nepoužívá analytiky třetích stran."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 10 */}
				<Typo
					label={"10) Dostupnost, údržba a změny"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						'• Službu poskytujeme "tak jak je". Může obsahovat chyby, být nedostupná nebo se měnit bez předchozího oznámení.'
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Vyhrazujeme si právo měnit, pozastavit nebo ukončit službu nebo její části."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 11 */}
				<Typo
					label={"11) Odpovědnost"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"• Neodpovídáme za nepřímé škody, ušlý zisk, ztrátu dat ani škody způsobené třetími stranami."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Za obsah inzerátů odpovídá uživatel, který je zveřejnil."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Nic z výše uvedeného nevylučuje odpovědnost, kterou podle práva vyloučit nelze."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 12 */}
				<Typo
					label={"12) Zrušení účtu, obsah a zůstatky"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Účet můžeš kdykoli zrušit. Můžeme zrušit nebo pozastavit účet porušující pravidla či zákon. Některé technické kopie obsahu mohou krátce přetrvat v cache CDN."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"Kredit / zůstatky při zrušení účtu:"}
					display={"block"}
					size={"md"}
					font={"semi"}
					text={"left"}
				/>

				<Typo
					label={
						"• Nevyčerpaný kredit (viz bod 16) není vyplácen v penězích, nepodléhá úročení a zrušením účtu zaniká bez náhrady."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Výjimkou jsou případy vyžadované zákonem nebo zjevná fakturační chyba z naší strany, které posoudíme individuálně."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 13 */}
				<Typo
					label={"13) Změny podmínek"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Tyto podmínky můžeme měnit. Podstatné změny oznámíme v aplikaci nebo e‑mailem. Pokračováním v používání služby bereš změny na vědomí."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 14 */}
				<Typo
					label={"14) Právo a řešení sporů"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"Tyto podmínky se řídí právem České republiky. Spory se budeme snažit řešit smírně; pokud to nepůjde, u příslušného soudu v ČR."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 15 */}
				<Typo
					label={"15) AI a automatizované zpracování"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"• Služba neodesílá tvůj obsah (texty, fotky, metadata) žádným AI službám třetích stran a nezpracovává ho pomocí umělé inteligence (včetně modelů strojového učení)."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						'• Nepoužíváme profilování ani automatizované rozhodování (žádné "robotické posuzování"), které by vůči tobě mělo právní účinky nebo se tě významně dotýkalo.'
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Pokud by se to v budoucnu změnilo, promítneme to do těchto Podmínek a do Zásad ochrany osobních údajů a vyžádáme si tvůj souhlas, bude‑li to potřeba."
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 16 */}
				<Typo
					label={"16) Kredit"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"• Co je kredit: vnitřní bodíky do služby (např. zvýraznění inzerátu), není to bankovní účet ani elektronické peníze"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Dobití: po zaplacení je kredit hned k dispozici"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Platby: zpracovává Stripe; údaje o platební kartě u nás neukládáme"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Vrácení peněz: kredit nejde vyplatit v penězích, převést na jiný účet ani úročit"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Odstoupení: dodání začíná hned, jde o digitální obsah bez nosiče, proto po dobití nemáš 14denní právo na odstoupení u nevyužité části kreditu"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Změny: nabídku funkcí a ceny můžeme upravit s předchozím upozorněním v aplikaci"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Zneužití: při podvodu nebo porušení podmínek můžeme kredit pozastavit nebo odebrat v nezbytném rozsahu"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Chyby: zjevné fakturační chyby opravíme a prostředky vrátíme původním kanálem, pokud to jde, nebo připíšeme náhradní kredit"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Section 17 */}
				<Typo
					label={"17) E‑maily"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
				/>

				<Typo
					label={
						"• Posíláme je jen kvůli důležitým akcím ve službě, jako je registrace, reset hesla, souhrn inzerátu nebo bezpečnostní upozornění"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Neposíláme přímý marketing, newslettery ani obchodní sdělení bez tvého výslovného souhlasu"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Nastavení držíme střídmé, cílem je nespamovat a připomínat se co nejméně"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Tvoji e‑mailovou adresu neprodáváme ani neposkytujeme třetím stranám pro jejich vlastní marketing"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Pro doručení e‑mailů můžeme využít důvěryhodného technického poskytovatele (zpracovatele), kterému předáváme jen to, co je nutné k odeslání a který je smluvně vázán mlčenlivostí a bezpečností"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• U části upozornění půjde frekvenci omezit nebo je vypnout v nastavení účtu; právní a bezpečnostní zprávy vypnout nejdou"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				{/* Quick summary */}
				<Typo
					label={"Rychlé shrnutí (právně nezávazné)"}
					display={"block"}
					size={"xl"}
					font={"bold"}
					text={"left"}
					tone={"primary"}
				/>

				<Typo
					label={"• E‑maily: jen transakční, bez marketingu"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Platby: Stripe"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Alfa: věci se mohou měnit a mizet"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• U nás je uložen jen e‑mail a hash hesla"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Fotky jsou doručované přes Bunny CDN"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={"• Lokalita inzerátu je zobecněná"}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Back‑end běží na Vercelu + Neon, obrázky na Bunny, adresy napovídá Geoapify"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Věk: 15+ pro používání; prodej 18+ (nebo 15–17 se souhlasem/zastoupením rodiče)"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>

				<Typo
					label={
						"• Kredit: není e‑money; nejde vyplatit, využiješ ho jen uvnitř appky"
					}
					display={"block"}
					size={"md"}
					text={"left"}
				/>
			</Container>
		);
	},
});

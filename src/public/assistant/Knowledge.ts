export namespace Knowledge {
	export type Index =
		| "transactions-states"
		| "messages"
		| "transaction-expiration"
		| "early-access"
		| "early-delivery"
		| "release-window";

	export interface Topic {
		key: string;
		title: string;
		summary: string;
		content: string;
		related?: Index[];
	}
}

export const KnowledgeIndex = {
	"transactions-states": {
		key: "transactions-states",
		title: "Stavy transakce",
		summary: "Přehled všech stavů transakce a co znamenají.",
		content: `
  pending = kupující projevil zájem, ale ještě není otevřená domluva.
  open = prodejce přijal, je možné si psát a domlouvat detaily.
  resolved = prodejce označil jako vyřešené.
  dispute = otevřený spor po resolved.
  rejected = někdo to odmítl.
  sold = prodáno jinde nebo systémově uzavřeno jako prodané.
  expired = transakce vypršela po neaktivitě.
  success = kupující potvrdil, že obchod dopadl dobře.
  closed = kupující transakci uzavřel.
      `.trim(),
		related: [
			"messages",
			"transaction-expiration",
		],
	},
	"transaction-expiration": {
		key: "transaction-expiration",
		title: "Expirace transakce",
		summary: "Kdy transakce vyprší a co se pak stane.",
		content: `
  Transakce standardně expiruje po 3 dnech bez aktivity.
  Po expiraci je read-only a nejde znovu otevřít.
      `.trim(),
		related: [
			"transactions-states",
		],
	},
	"early-access": {
		key: "early-access",
		title: "Early Access",
		summary: "Jak funguje předčasné zobrazení nových inzerátů.",
		content: `
  Early Access je výhoda kupujícího.
  Umožňuje vidět nové inzeráty hned bez čekání na release window.
      `.trim(),
		related: [
			"release-window",
		],
	},
	"release-window": {
		key: "release-window",
		title: "Release window",
		summary: "Zpoždění publikace inzerátu v listingu.",
		content: `
  Nový inzerát se standardně objeví v listingu až po release window.
  Early Access to pro kupujícího ignoruje.
  Early Delivery to ruší pro konkrétní inzerát pro všechny.
      `.trim(),
		related: [
			"early-access",
			"early-delivery",
		],
	},
} as const satisfies Partial<Record<Knowledge.Index, Knowledge.Topic>>;

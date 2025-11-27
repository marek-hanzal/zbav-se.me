---
title: Přehled vychytávek
authors: [marek-hanzal]
tags:
  - features
---

Dneska se rozepíšu o **vlastnostech appky** - některé jsou běžné, některé můžou být _**unikátní**_.

:::danger[Pozor pozor!]
Tento článek **souhrnně obsahuje**, co appka umí/plánuje - _**bez těchto věcí ani nedojde ke spuštění**_.
:::

Dozvíš se, co je v plánu a v **čem jsme zajímaví**. Snad se ti to bude líbit - _**pojďme na to**_!

<!-- truncate -->

## Anonymita

### Světlá stránka

Toto vnímám jako **klíčový prvek**, jelikož obecně po tobě bazary chtějí _**jméno, email, telefonní číslo**_ a velikost bot. Já systém nastavil tak, že si **vezmu email** a to jen pro spam (_*ne doslova*_) a přihlášení. Jméno ani _**nic jiného mě nezajímá**_ - jestli pustíš telefon nebo email je **čistě na tobě**.

:::tip
Předpoklad je takový, že jdu **něco prodat** a s kupujícím můžu mít **interakci jednou za život**, není potřeba mu cokoli dávat. Opakujícího se kupujícího appka označí, takže máš přehled.
:::

### Temná stránka

Možná ti vrtá hlavou, **jak to bude s bezpečností**, když jsou všichni **za oponou**? Odpovědí je **tvrdý systém hodnocení**. Appka počítá hodnocení (_rating_) každého, takže se můžeš **přehledně podívat** na celkové skóre a **podle toho se rozhodnout**, zda jdeš do obchodu.

**Každá interakce** mezi uživateli generuje toto skóre na pozadí (_**např. nedokončená transakce**_), nebo i explicitně - _nelíbí se ti jednání_, pleskneš špatné hodnocení.

Díky tomuto mechanismu _**dokážeš celkem přesně odhadnout**_, do čeho jdeš, přestože **protistranu vůbec nevidíš**.

Je to celkem tvrdý systém, ale **věřím tomu**, že tato **sociální kontrola** pomůže _**vyhnat nezbedníky**_ a obecně nastavit **vysokou kvalitu** interakcí. Nemusíš se bát, že _když dostaneš špatné hodnocení že tě to zdevastuje_, na to myslíme - ale nesmí se to opakovat pravidelně.

:::info[Skórování]
Celkově tento systém je **dost komplexní** pro tento článek - časem se objeví v dokumentaci, jestli máš chuť si počíst.
:::

## Kupující a prodávající

V tomto ohledu si myslím, že se **budeme lišit** - appka je **od základu** stavěna pro rozdělení těch, kteří spíše **prodávají** a ti, kteří jsou zvědaví, případně rovnou **nakupují**.

:::tip
**Přechod** mezi sekcemi je snadný, takže se nemusíš bát žádného tření nebo složitostí. Smyslem je jasně **rozdělit** vlastnosti appky, aby se křížem _**nemotaly věci, které tě nezajímají**_.
:::

### Prodejce

Más po ruce **všechny nástroje**, které souvisí s prodejem a jeho správou - víš, **co nabízíš**, víš, **jaké transakce** máš otevřené. Nic jiného ti do tvé práce nekecá, **nic jiného neruší**. Feed a seznam inzerátů je jinde, pokud tě nezajímají, jako by pro tebe **neexistovaly**.

Porovnávání a analytika jsou také po ruce, takže není třeba chodit na prodej a **ručně zkoumat**, jak jsou na tom **konkurenční inzeráty**.

### Kupující/zvědavec

_**Natvrdo**_ - tahle část je stavěná tak, aby **upoutala pozornost** a udržela tě v appce, dokud máš mentální sílu. **Nastavíš si**, co tě **zajímá** a pak sleduješ, co se _**objevilo nového**_. Co nás odlišuje (_alespoň teď_) je možnost si **zcela přizpůsobit** svůj feed. Žádné **přechytřelé** algoritmy, žádná divočina - _**všechno má jasná pravidla**_.

Cílem je ti **dát místo**, kam se s **radostí podíváš** a budeš jen tak **projíždět inzeráty**, jestli náhodou nenajdeš **nějaký poklad**.

## Inzeráty

### Přidání

**Rychlé**. Pár kliknutí v **_moderním průvodci_** a hotovo. Když máš fotky, _**inzerát naklikáš do minuty**_.

:::tip[Rychlé, vskutku!]
**Uvědomujeme si**, že lidi **baví prodávat**, ale proces **zadávání** všech těch _**nudných údajů prudí**_. Co s tím? Vytvořit takový zážitek, že to **bude otravné, jen méně** - rychlá bolest, všichni známe, jak je to s náplastmi.
:::

### Index

Tohle je trošku technická část, ale nutné zmínit – zpočátku budeme _**maličká služba**_, která své postavení musí budovat jak u tebe, tak i v _samotném divokém internetu_.

**To ale nemění nic na tom, že přesně víme, co děláme.**  
Inzeráty _**publikujeme**_ tak, aby byly volně dohledatelné třeba přes **Google**, a s časem se bude zlepšovat i **veřejná viditelnost** – jak roste obsah, roste i důvěra vyhledávačů.

### Řazení

Nic moc světoborného, ale je to **fajn věc** - jako prodejce **nastavíš výchozí lokaci** inzerátu (_cokoli, co sežere naše adresní služba, **klidně jen město**_) a kupující si pak můžou **řadit inzeráty** podle vzdálenosti. Je to moc fajn, když chceš **najít něco blízko** a funguje to skvěle.

:::tip
Pořád platí **anonymita** - digitální _**stopa zanikne**_ spolu s inzerátem, takže se nemusíš bát, že _tvoji adresu bude znát půl světa_ - jak moc konkrétní budeš je **zcela na tobě**.
:::

## Feed (seznam inzerátů)

Asi nic moc nového, ale vybrali jsme přístup zobrazení jako má např. **Instagram** - posouváš, koukáš, co se ti líbí, **přihazuješ do košíku**, jdeš dál.

:::tip
Pointa je mít hned na **první dobrou** zobrazenou **fotku**, takže prodávající můžou mít _**motivaci dělat pořádné fotky**_, jinak inzerát prostě přeskočíš a jdeš dál.
:::

**Ovládání je jednoduché**, všechno hezky po ruce (_resp. po palci_).

## Nastavení feedu

Tohle bylo **těžké** rozhodnutí, nicméně ve výchozím stavu si **"musíš" naklikat**, co tě **zajímá** (_tzn. připravit si svůj feed_). Jedná se o ((pár rychlých)) kroků, které můžeš klidně _**prohopsat**_ až na konec a uložit (_což fakticky vygeneruje feed všech inzerátů_).

**Smyslem** této vychytávky **je nabídnout** jen to, co **tě reálně zajímá** a poladit si _**seznam přesně na míru**_. Nejedná se o klasický omezený filtr, ale _**skutečné nastavení**_ toho, jaké **inzeráty** pro tebe z appky mají **lézt ven**.

## Košík

Tohle už budeš **znát odjinud** - než se pustíš do obchodu, **můžeš** si jednotlivé inzeráty **označit** a juknout se, které se ti **líbí nejvíc**. Je to něco jako _**"Oblíbené"**_, ale jelikož "Oblíbené" v tomto kontextu _**nedává smysl**_, šli jsme spíš cestou názvosloví e-shopu.

## Transakce

Tady se odehrává **veškerá akce** - ve výchozím stavu si **odklikneš, že máš zájem**, prodejce tě potvrdí nebo odmítne (_třeba už něco uzavírá_), domluvíte místo, čas, pokecáte, pošlete fotky, ohodnotíte transakci, _**konec**_.

**Nic složitého**, smyslem je na jednom místě _**zobrazit průběh celého obchodu**_ a poskytnou nástroje pro jeho správu.

:::tip[Cože prosím?]
**Chat**. Představ si klasický chat, kde jsou všechny **klíčové události**, včetně vašich zpráv a fotek.
:::

Tohle budeš při obchodu **používat nejčastěji**, budeš mít jasný **přehled**, co se děje, kde máš **aktivní obchody**, které vyšuměly (_neaktivita_) nebo byly uzavřené jinde.

## Skórování

:::tip
Už jsem o tom mluvil, tady už **jen ve zkratce**, ať máš přehled.
:::

### Uživatelé

V běžném provozu si toho **ani nevšimneš** a nijak ti to neuškodí. Tvoje skóre se upravuje jen **explicitní interakcí** mezi uživateli (_např. v rámci transakce_). Cílem je přiřadit ti váhu, ale nediskriminovat (_např. nové účty na začátku budete mít všichni_).

**Cílem je odhadnout**, s kým máš tu čest a jak se cca chová - zdarma uvidíš jen **celkové hodnocení**, za nějaký drobný se dozvíš **konkrétní rozbor** (_např. budeš vědět, že uživatel často zahazuje transakce a nedokončuje je_).

:::danger[Skóre]
Uvědomuji si, že tě tohle může **zvednout ze židle**, takový ten pocit _**"... nechci, aby mě něco šmírovalo!!"**_ - důležité je si **uvědomit**,
že _**my to přiznáme**_, zdokumentujeme přesně, co děláme a hlavně tento _**systém je ve tvých rukách**_. Jiné služby tohle dělají na pozadí (_generují si data pro cílené reklamy_) a ty z **toho nemáš nic**.
:::

## Epilog

Je toho ještě **mnohem více**, nicméně tento článek popisuje **základní kameny** aplikace, takže _**víš, co čekat**_. Další články budou vycházet už **menší** diskutující **dílčí sekce** rozepsané podrobněji.

import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";

export namespace TransactionSheet {
    export interface Props extends BottomSheet.Props {
        transaction: tTransaction;
    }
}

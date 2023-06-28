import { WhereFilterOp } from "firebase/firestore";

export interface FirestoreQuery {
  property: string;
  operator: WhereFilterOp;
  value: unknown;
}

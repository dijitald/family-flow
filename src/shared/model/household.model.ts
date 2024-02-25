import { Chore } from "./chore.model";
import { Transaction } from "./transaction.model";


export class Household {
    constructor(
        public id: string, 
        public members: string[], 
        public chores: Chore[],
        public createdOn: Date,
        public createdBy: string,
        public categories: string[], //categories to be tracked (chore, gift, shopping, amazon, etc)
        public transactions: Transaction[],
        ) {}
}
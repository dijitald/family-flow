import { Household } from "./household.model";
import { User } from "./user.model";

export class Activity {
    constructor(
        public id: number,
        public household: Household,
        public householdId: string, 
        public date: Date,
        public user: User,
        public userId: number,
        public amount: number,
        public isCredit: boolean,
        public description: string, //name of chore or use of funds
        public tags: string, 
    ) { }
}
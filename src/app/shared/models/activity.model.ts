import { Household } from "./household.model";
import { User } from "./user.model";

export class Activity {
    constructor(
        public householdid: string, 
        public date: Date,
        public userName: string,
        public userId: number,
        public amount: number,
        public type: ActivityType,
        public description: string, //name of chore or use of funds
        public tags?: string,
        public id: number = -1,
    ) { }
}

export enum ActivityType {
    Credit = 1,
    Debit = -1,
}

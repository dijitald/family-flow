import { Household } from "./household.model";
import { User } from "./user.model";

export class Membership{

    constructor(
        public id: number,
        public householdid: string,
        public household: Household,
        public userid: string,
        public user: User,
        public role: string,
        public balance: number,
        public createdOn: Date,
    ){}
}

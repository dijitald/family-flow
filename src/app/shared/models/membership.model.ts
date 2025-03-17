import { Household } from "./household.model";

export class Membership{

    constructor(
        public id: number,
        public householdid: string,
        public userid: number,
        public role: string,
        public balance: number,
        public createdOn: Date,
        public household?: Household,
    ){}
}

import { Activity } from "./activity.model";
import { Household } from "./household.model";
import { Membership } from "./membership.model";

export class User{

    constructor(
        public id: string,
        public guid: string, //liveid
        public email: string,
        public sms: string,
        public name: string,
        public createdOn: Date,
        public lastLogon: Date,
        public avatarPath: string,
        public householdid: string,
        public households?: Membership[],
    ){}
    public get household(): Household {
        if (this.households && this.households.length > 0) {
            return this.households.find(h => h.householdid === this.householdid)?.household;
        }
        return null;
    }
}

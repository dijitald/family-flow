import { Membership } from "./membership.model";

export class User{

    constructor(
        public id: number,
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

    static fromPlainObject(obj: any): User {
        return new User(
            obj.id,
            obj.guid,
            obj.email,
            obj.sms,
            obj.name,
            new Date(obj.createdOn),
            new Date(obj.lastLogon),
            obj.avatarPath,
            obj.householdid,
            obj.households
        );
    }

    public get membership(): Membership {
        if (this.households && this.households.length > 0) {
            return this.households.find(h => h.householdid === this.householdid);
        }
        return null;
    }
}

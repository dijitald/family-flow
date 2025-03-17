import { Activity } from "./activity.model";
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
        public household?: Membership,
    ){}
}

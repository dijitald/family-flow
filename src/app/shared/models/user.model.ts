import { Activity } from "./activity.model";
import { Membership } from "./membership.model";

export class User{

    constructor(
        public id: string,
        public guid: string, //liveid
        public email: string,
        public name: string,
        public createdOn: Date,
        public lastLogin: Date,
        public avatarPath: string,
        public activehousehold_id: string,
        public households?: Membership[],
        public activities?: Activity
    ){}
}

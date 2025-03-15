import { Task } from "./task.model";
import { Activity } from "./activity.model";
import { User } from "./user.model";

export class Household {
    constructor(
        public id: string,
        public name: string,
        public createdOn: Date,
        public users: User[], 
        public tasks: Task[],
        public activities: Activity[],
        ) {}
}
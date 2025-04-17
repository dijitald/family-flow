import { Household } from "./household.model";

export class Task {

    constructor(
        // public household: Household = null,
        public createdBy: string,
        public householdid: string,
        public name: string = "New Task",
        public description: string = "Task Description",
        public createdOn: Date = new Date(),
        public id: number = -1,
        public rewardAmount: number = 1,
        public active: boolean = true,
        public lastCompleted?: Date,
        public nextDueDate? : Date,

        public frequency: Frequency = Frequency.Weekly, // Daily, Weekly, Monthly, Yearly
        public everyWeekday: boolean = false, //[daily]
        public interval: number = 1, //[daily|weekly|monthly|yearly] (Number of units of a given recurrence type between occurrences.)
        public dayOfWeek: number = 7, //[weekly/monthly/yearly] mask
        public dayOfMonth: number = 0, //[monthly/yearly]
        public instance: number = 0, //[monthly/yearly] (first, second, third, fourth, last) (Specifies the recurring appointment series to occur on every Nth day of a month.)
        public isInstanceBasedMonthly: boolean = false, //[monthly]
        public monthOfYear: number = 0, //[yearly]
        public isInstanceBasedYearly: boolean = false, //[yearly]
        ) { }
}

export enum Frequency {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = 'Yearly'
  }
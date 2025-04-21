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
        public rewardAmount: number = 1.00,
        public active: boolean = true,
        public lastCompleted?: Date,
        public nextDueDate? : Date,

        public interval: number = 1, //[daily|weekly|monthly|yearly] (Number of units of a given recurrence type between occurrences.)
        public frequency: Frequency = Frequency.week, // Daily, Weekly, Monthly, Yearly
        public dayOfWeek: number = 32, //[weekly/monthly/yearly] mask
        // public instance: Instance = Instance.last, //[monthly/yearly] (first, second, third, fourth, last) (Specifies the recurring appointment series to occur on every Nth day of a month.)
        // public everyWeekday: boolean = false, //[daily]
        // public dayOfMonth: number = 0, //[monthly/yearly]
        // public isInstanceBasedMonthly: boolean = false, //[monthly]
        // public monthOfYear: number = 0, //[yearly]
        // public isInstanceBasedYearly: boolean = false, //[yearly]
        ) { }
}

export enum Frequency {
    day = 'day',
    week = 'week',
    month = 'month',
    year = 'year'
  }

  // export enum Instance {  
  //   first = 1,
  //   second = 2,
  //   third = 3,
  //   fourth = 4,
  //   last = 0
  // }
  export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 4,
    Thursday = 8,
    Friday = 16,
    Saturday = 32,
    Sunday = 64,
  }


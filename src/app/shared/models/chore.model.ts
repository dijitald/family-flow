
export class Chore {

    constructor(
        public id: string, 
        public name: string, 
        public description: string,
        public active: boolean,
        public rewardAmount: number,
        public lastCompleted: Date,
        public nextDueDate : Date,

        public createdOn: Date,
        public createdBy: string,
        public modifiedOn: Date,
        public modifiedBy: string,

        public frequency: string, // Daily, Weekly, Monthly, Yearly
        public everyWeekday: boolean, //[daily]
        public interval: number, //[daily|weekly|monthly|yearly] (Number of units of a given recurrence type between occurrences.)
        public dayOfWeek: number, //[weekly/monthly/yearly] mask
        public dayOfMonth: number, //[monthly/yearly]
        public instance: number, //[monthly/yearly] (first, second, third, fourth, last) (Specifies the recurring appointment series to occur on every Nth day of a month.)
        public isInstanceBasedMonthly: boolean, //[monthly]
        public monthOfYear: number, //[yearly]
        public isInstanceBasedYearly: boolean, //[yearly]
        ) { }
}
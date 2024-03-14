export class Transaction {
    constructor(
        public id: string,
        public date: Date,
        public createdById: string,
        public createdByUsername: string,
        public amount: number,
        public description: string, //name of chore or use of funds
        public category: string, 
        public approved: boolean,
    ) { }
}
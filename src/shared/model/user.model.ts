

export class User{

    constructor(
        public id: string,
        public username: string,
        public email: string,
        public role: string, // Admin, User
        //public image: ImageData,
        public households: string[],
        public createdOn: Date,
    ){}
}
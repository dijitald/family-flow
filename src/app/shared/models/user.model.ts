

export class User{

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public activehousehold: string,
        public role: string, // admin, member
        public createdOn: Date,
 //       public image: ImageData,
 //       public households: string[],
    ){}
}

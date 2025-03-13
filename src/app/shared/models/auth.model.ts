
export class Auth{
    constructor(
        public userid: string,  // homeAccountId
        public name: string,    // name
        public email: string,   // username
        public isLoggedIn: boolean,
        public authError: string,
        public loading: boolean,
    ){}
}

// environment: "login.windows.net"
// homeAccountId: "00000000-0000-0000-3473-9e178c9c1fa3.9188040d-6c67-4c5b-b112-36a304b66dad"
// idTokenClaims: {ver: '2.0', iss: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0', sub: 'AAAAAAAAAAAAAAAAAAAAACqwtxUSo4eRguKE9eSLzfI', aud: '86ab2bdb-345f-4a10-aaf8-ab3bdb0664b8', exp: 1710508275, …}
// localAccountId: "00000000-0000-0000-3473-9e178c9c1fa3"
// name: "drew dials"
// nativeAccountId: undefined
// tenantId: "9188040d-6c67-4c5b-b112-36a304b66dad"
// username: "drew.dials@outlook.com"

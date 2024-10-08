

export interface IUser {
      id: number;
      name: string;
      email: string;
    }
    
    // Define the User class that implements the IUser interface
    export class User implements IUser {
      constructor(
        public id: number,
        public name: string,
        public email: string
      ) {}
    }
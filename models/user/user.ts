

export interface WSUserInterface {
      id: number;
      name: string;
      email: string;
    }
    
    // Define the User class that implements the IUser interface
export class User implements WSUserInterface {
      constructor(
        public id: number,
        public name: string,
        public email: string
      ) {}
    }
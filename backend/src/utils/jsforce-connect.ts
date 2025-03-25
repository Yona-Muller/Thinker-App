// import * as jsforce from 'jsforce';

// class SalesforceConnection {
//   private static instance: SalesforceConnection;
//   private connection: jsforce.Connection;
//   private username: string;
//   private password: string;

//   private constructor() {
//     this.username = process.env.SF_USERNAME || '';
//     this.password = (process.env.SF_PASSWORD || '') + (process.env.SF_TOKEN || '');
//     this.connection = new jsforce.Connection({});

//     // if (!this.username || !this.password) {
//     //     throw new Error("Salesforce credentials are not set in environment variables.");
//     // }
//   }

//   public static getInstance(): SalesforceConnection {
//     if (!SalesforceConnection.instance) {
//       SalesforceConnection.instance = new SalesforceConnection();
//     }
//     return SalesforceConnection.instance;
//   }

//   public async login(): Promise<jsforce.Connection> {
//     try {
//       await this.connection.login(this.username, this.password);
//       return this.connection;
//     } catch (error) {
//       console.error('Error logging into Salesforce:', error);
//       throw error;
//     }
//   }
// }

// export default SalesforceConnection;

import {Client, Account} from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('677e37be002c574ee32e');

const account = new Account(client);

export {account, client};
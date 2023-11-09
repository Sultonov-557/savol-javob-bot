import * as fs from "fs";

const users = fs.readFileSync(__dirname + "/database/users.json");
const savollar = fs.readFileSync(__dirname + "/database/savollar.json");

async function addUser(id: number, name: string, score: number) {
    
}

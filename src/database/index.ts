import Dexie, { Table } from "dexie";

export interface Log {
  id?: number;
  message: string;
  timestamp: string;
  tag: string;
}

export class LoggerDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  logs!: Table<Log>;

  constructor() {
    super("loggerDB");
    this.version(1).stores({
      logs: "++id, message, timestamp, tag", // Primary key and indexed props
    });
  }
}

export const db = new LoggerDB();

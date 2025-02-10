/* eslint-disable no-var */
interface MongooseGlobal {
    connection: Connection | null;
    promise: Promise<Connection> | null;
}

import { Connection } from "mongoose";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export type {MongooseGlobal};
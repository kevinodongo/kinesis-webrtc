/**
 * Kinesis Video WebRTC
 * Copyright 2019-2019 Jogevk Group Limited,
 * Inc. or its affiliates. All Rights Reserved.
 * (https://jogevk.net)
 */
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

export { Role } from "./Role";
export { KinesisClient } from "./KinesisClient";

export const VERSION = process.env.VERSION;

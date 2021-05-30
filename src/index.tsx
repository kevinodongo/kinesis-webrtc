/**
 * Kinesis Video WebRTC 
 * Copyright 2019-2019 Jogevk Group Limited, 
 * Inc. or its affiliates. All Rights Reserved.
 * (https://jogevk.net)
*/
require('dotenv').config();

export { Role } from "./Role"
export { KinesisClient } from "./KinesisClient"

export const VERSION = process.env.VERSION
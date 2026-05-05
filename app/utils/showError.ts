"use client";

import { message } from "antd";

export function showError(error: unknown, fallback = "Something went wrong."): void {
  let msg = fallback;
  if (error instanceof Error) {
    const match = /\(\d+: (.+)\)/.exec(error.message);
    msg = match ? match[1] : error.message;
  }
  message.error(msg);
}

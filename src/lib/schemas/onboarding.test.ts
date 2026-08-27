import { describe, expect, it } from "vitest";
import { isCanadianPhoneNumber } from "./onboarding";

describe("isCanadianPhoneNumber", () => {
  it.each([
    ["+13062776103", "Saskatchewan (306)"],
    ["+14165551234", "Toronto (416)"],
    ["+16045551234", "Vancouver (604)"],
    ["+15145551234", "Montreal (514)"],
  ])("accepts %s — %s", (phone) => {
    expect(isCanadianPhoneNumber(phone)).toBe(true);
  });

  it.each([
    ["+12125551234", "US number (New York, 212)"],
    ["+15555555555", "unassigned area code"],
    ["+11234567890", "area code starting with 1"],
    ["+441234567890", "UK number"],
    ["+1416555123", "too short"],
    ["4165551234", "missing country code"],
    ["", "empty"],
  ])("rejects %s — %s", (phone) => {
    expect(isCanadianPhoneNumber(phone)).toBe(false);
  });
});

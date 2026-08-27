import { describe, expect, it } from "vitest";
import { isCanadianPhoneNumber, onboardingFormSchema } from "./onboarding";

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

describe("onboardingFormSchema", () => {
  const valid = {
    firstName: "Ada",
    lastName: "Lovelace",
    phone: "+14165551234",
    corporationNumber: "123456789",
  };

  it("is synchronous and accepts valid values", () => {
    expect(onboardingFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a corporation number of the wrong length", () => {
    const result = onboardingFormSchema.safeParse({
      ...valid,
      corporationNumber: "12345",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Corporation number must be 9 characters",
    );
  });

  it("trims whitespace from all fields", () => {
    const result = onboardingFormSchema.parse({
      firstName: " Ada ",
      lastName: " Lovelace ",
      phone: " +14165551234 ",
      corporationNumber: " 123456789 ",
    });
    expect(result).toEqual(valid);
  });
});

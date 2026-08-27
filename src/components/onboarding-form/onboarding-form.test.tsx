import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OnboardingForm from ".";

const CORPORATION_NUMBER_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/corporation-number";
const PROFILE_DETAILS_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/profile-details";

const VALID_CORPORATION_NUMBER = "826417395";
const VALID_VALUES = {
  firstName: "Hello",
  lastName: "World",
  phone: "+13062776103",
  corporationNumber: VALID_CORPORATION_NUMBER,
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type SubmitHandler = (body: typeof VALID_VALUES) => Response;

/** Route-aware fetch stub for the corporation-number GET and profile-details POST. */
function mockFetch(onSubmit: SubmitHandler = () => new Response(null)) {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      if (url.startsWith(CORPORATION_NUMBER_URL)) {
        const number = url.slice(CORPORATION_NUMBER_URL.length + 1);
        return number === VALID_CORPORATION_NUMBER
          ? jsonResponse({ corporationNumber: number, valid: true })
          : jsonResponse({
              valid: false,
              message: "Invalid corporation number",
            });
      }
      if (url === PROFILE_DETAILS_URL) {
        return onSubmit(JSON.parse(String(init?.body)));
      }
      throw new Error(`Unexpected fetch: ${url}`);
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <OnboardingForm />
    </QueryClientProvider>,
  );
}

function getFields() {
  return {
    firstName: screen.getByLabelText("First Name"),
    lastName: screen.getByLabelText("Last Name"),
    phone: screen.getByLabelText("Phone Number"),
    corporationNumber: screen.getByLabelText("Corporation Number"),
    submit: screen.getByRole("button", { name: /submit/i }),
  };
}

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  values: typeof VALID_VALUES = VALID_VALUES,
) {
  const fields = getFields();
  await user.type(fields.firstName, values.firstName);
  await user.type(fields.lastName, values.lastName);
  // Focusing the phone input prefills "+1", so type only the rest.
  await user.type(fields.phone, values.phone.replace(/^\+1/, ""));
  await user.type(fields.corporationNumber, values.corporationNumber);
  return fields;
}

describe("OnboardingForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a required-field error under every field when submitted empty", async () => {
    const fetchMock = mockFetch();
    renderForm();

    await user.click(getFields().submit);

    expect(await screen.findByText("First name is required")).toBeVisible();
    expect(screen.getByText("Last name is required")).toBeVisible();
    expect(screen.getByText("Phone number is required")).toBeVisible();
    expect(screen.getByText("Corporation number is required")).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalledWith(
      PROFILE_DETAILS_URL,
      expect.anything(),
    );
  });

  it("validates the phone number on blur and rejects non-Canadian numbers", async () => {
    mockFetch();
    renderForm();

    await user.type(getFields().phone, "441234567890");
    await user.tab();

    expect(
      await screen.findByText(
        "Enter a valid Canadian phone number starting with +1",
      ),
    ).toBeVisible();
  });

  it("prefills the phone number with +1 on focus when empty", async () => {
    mockFetch();
    renderForm();
    const { phone } = getFields();

    await user.click(phone);
    expect(phone).toHaveValue("+1");

    await user.type(phone, "3062776103");
    await user.tab();
    await user.click(phone);
    expect(phone).toHaveValue("+13062776103");
  });

  it("validates the corporation number against the API on blur", async () => {
    const fetchMock = mockFetch();
    renderForm();

    await user.type(getFields().corporationNumber, "123456780");
    await user.tab();

    expect(await screen.findByText("Invalid corporation number")).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      `${CORPORATION_NUMBER_URL}/123456780`,
    );
  });

  it("submits the form values and shows a success message on 200", async () => {
    const fetchMock = mockFetch();
    renderForm();

    const { submit } = await fillForm(user);
    await user.click(submit);

    const successButton = await screen.findByRole("button", {
      name: /success/i,
    });
    expect(successButton).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledWith(
      PROFILE_DETAILS_URL,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_VALUES),
      }),
    );
  });

  it("shows the server error message when submission fails with 400", async () => {
    mockFetch(() => jsonResponse({ message: "Invalid phone number" }, 400));
    renderForm();

    const { submit } = await fillForm(user);
    await user.click(submit);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid phone number",
    );
    expect(submit).toBeEnabled();
  });

  it("disables the submit button while the request is in flight", async () => {
    let resolveSubmit: (response: Response) => void = () => {};
    mockFetch(
      () =>
        new Promise<Response>((resolve) => {
          resolveSubmit = resolve;
        }) as unknown as Response,
    );
    renderForm();

    const { submit } = await fillForm(user);
    await user.click(submit);

    await waitFor(() => expect(submit).toBeDisabled());

    resolveSubmit(new Response(null));
    expect(
      await screen.findByRole("button", { name: /success/i }),
    ).toBeDisabled();
  });
});

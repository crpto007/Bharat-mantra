export async function postJson<TResponse, TBody>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string" && data.error.trim()
        ? data.error
        : "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return data as TResponse;
}

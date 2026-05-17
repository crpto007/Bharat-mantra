export async function readJsonResponse(res: Response) {
  const responseText = await res.text();
  let data: any = {};

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: responseText };
    }
  }

  if (!res.ok) {
    throw new Error(
      data.error || data.message || `Request failed with status ${res.status}`,
    );
  }

  return data;
}

import { API_URL } from "../global";

export async function Tiers() {
  const response = await fetch(`${API_URL}/coverage_tiers`);
  return response.json();
}

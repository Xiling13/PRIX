export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return null

  let url = trimmed
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    if (!parsed.hostname.includes('.')) return null
    return parsed.href.replace(/\/$/, '') || parsed.href
  } catch {
    return null
  }
}

export function isValidOfficialUrl(input: string): boolean {
  return normalizeUrl(input) !== null
}

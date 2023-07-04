// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Contains the function {@linkcode parseLinks} to help parse standard
 * request/response headers.
 *
 * @module
 */

interface Link {
  uri: string;
  [param: string]: string | undefined;
}

const commaTrimSplit = /\s*,\s*/;
const semicolonTrimSplit = /\s*;\s*/;
const quotedParamValue = /^"([^"]*)"$/;

function parseLink(rawLink: string) {
  const [uriRef, ...params] = rawLink.split(semicolonTrimSplit);
  if (uriRef.at(0) !== "<" || uriRef.at(-1) !== ">") return undefined;

  const result: Link = { uri: uriRef.slice(1, -1) };

  for (const param of params) {
    const [key, value] = param.split("=");
    const match = quotedParamValue.exec(value);
    result[key] = match?.[1] ?? value;
  }

  return result;
}

function parseAllLinks(links: string) {
  const result: Link[] = [];

  for (const rawLink of links.split(commaTrimSplit)) {
    const link = parseLink(rawLink);
    if (link) result.push(link);
  }

  return result;
}

// export type Response = {
//   headers: {
//     get(key: string): string | null;
//   };
// };

/**
 * Parses the `Link` header for the request, and returns the list of parsed URI's
 * with their parameters.
 *
 * @example
 * ```ts
 * import { parseLinks } from "https://deno.land/std@$STD_VERSION/http/headers.ts";
 *
 * const res = new Response(undefined, {
 *   headers: {
 *     link: `<https://example.com>; rel="preload"`,
 *   },
 * });
 *
 * parseLinks(res); // [{ uri: "https://example.com", rel: "preload" }]
 * ```
 *
 * See further information on the `Link` header on
 * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).
 */
export function parseLinks(request: Response): Link[] {
  const linkHeader = request.headers.get("link") ?? "";
  return parseAllLinks(linkHeader);
}

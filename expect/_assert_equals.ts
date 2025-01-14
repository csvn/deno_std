// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

// This file is copied from `std/assert`.

import { AssertionError } from "../assert/assertion_error.ts";
import { buildEqualErrorMessage } from "./_build_message.ts";
import { equal } from "./_equal.ts";
import { EqualOptions } from "./_types.ts";

/**
 * Make an assertion that `actual` and `expected` are equal, deeply. If not
 * deeply equal, then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example
 * ```ts
 * import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/assert_equals.ts";
 *
 * assertEquals("world", "world"); // Doesn't throw
 * assertEquals("hello", "world"); // Throws
 * ```
 *
 * Note: formatter option is experimental and may be removed in the future.
 */
export function assertEquals<T>(
  actual: T,
  expected: T,
  options?: EqualOptions,
) {
  if (equal(actual, expected, options)) {
    return;
  }

  const message = buildEqualErrorMessage(actual, expected, options || {});
  throw new AssertionError(message);
}

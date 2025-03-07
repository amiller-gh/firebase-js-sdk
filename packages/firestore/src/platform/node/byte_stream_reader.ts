/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BundleSource } from '../../util/bundle_reader';
import { toByteStreamReaderHelper } from '../../util/byte_stream';
import { Code, FirestoreError } from '../../util/error';
import { valueDescription } from '../../util/input_validation';

/**
 * On Node, only supported data source is a `Uint8Array` for now.
 */
export function toByteStreamReader(
  source: BundleSource,
  bytesPerRead: number
): ReadableStreamDefaultReader<Uint8Array> {
  if (!(source instanceof Uint8Array)) {
    throw new FirestoreError(
      Code.INVALID_ARGUMENT,
      `NodePlatform.toByteStreamReader expects source to be Uint8Array, got ${valueDescription(
        source
      )}`
    );
  }
  return toByteStreamReaderHelper(source, bytesPerRead);
}

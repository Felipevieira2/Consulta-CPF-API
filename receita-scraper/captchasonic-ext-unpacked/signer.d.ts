/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/getResultBufferPtr
 * @returns `usize`
 */
export declare function getResultBufferPtr(): number;
/**
 * assembly/index/alloc
 * @param len `i32`
 * @returns `usize`
 */
export declare function alloc(len: number): number;
/**
 * assembly/index/signRequest
 * @param ptr `usize`
 * @param len `i32`
 */
export declare function signRequest(ptr: number, len: number): void;
/**
 * assembly/index/generateFingerprint
 * @param ptr `usize`
 * @param len `i32`
 * @returns `i32`
 */
export declare function generateFingerprint(ptr: number, len: number): number;
/**
 * assembly/index/computeIntegrityHash
 */
export declare function computeIntegrityHash(): void;

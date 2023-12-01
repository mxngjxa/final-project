import { expect, describe, beforeEach, it, afterAll, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./use-fetch";

describe("Custon useFetch hook test", () => {
  const fetchSpy = vi.spyOn(global, "fetch");

  afterAll(() => {
    fetchSpy.mockRestore();
  });

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("Sets loading to true while awaiting response", async () => {
    interface SearchResponse {
      results: { title: string }[];
    }

    const testResponse: SearchResponse = {
      results: [{ title: "Star Wars" }],
    };

    type PartialResponse = Partial<Response> & {
      json: () => Promise<SearchResponse>;
    };

    const mockResolveValue: PartialResponse = {
      ok: true,
      json: () => Promise.resolve(testResponse),
    };

    fetchSpy.mockReturnValue(Promise.resolve(mockResolveValue as Response));

    // Action
    const { result } = renderHook(() => useFetch<SearchResponse>("test-uri"));

    // Assert on initial values
    expect(result.current.loading).toBeTruthy();

    // Assert on the times called and arguments given to fetch
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith("test-uri");

    // Assert response handling
    await waitFor(
      () => {
        expect(result.current.loading).toBeFalsy();
        expect(result.current.data).toHaveProperty("results");
        expect(result.current.data?.results).toHaveLength(1);
      },
      {
        timeout: 100,
      }
    );
  });

  it("returns a 'json' file in setData", async () => {
    const mockJsonResponse = '{"key": "value"}';

    const mockResolveValue: Response = {
      ok: true,
      json: () => Promise.resolve(JSON.parse(mockJsonResponse)),
    } as unknown as Response; // Cast to unknown and then back to Response

    fetchSpy.mockReturnValue(Promise.resolve(mockResolveValue));

    const { result } = renderHook(() => useFetch("test-uri"));

    // Wait for the hook to finish fetching and updating state
    await act(async () => {
      await waitFor(() => result.current.data !== null);
    });

    // Assert on whether 'json' argument in setData is a JSON file
    expect(() => JSON.parse(JSON.stringify(result.current.data))).not.toThrow();
  });
});

import { act, render } from "@testing-library/react";
import React from "react";
import { RbdInvariant } from "../../../../../src/invariant";
import { getRuntimeError } from "../../../../util/cause-runtime-error";
import { withError, withoutError, withWarn } from "../../../../util/console";
import App from "../../util/app";
import { keyboard, simpleLift } from "../../util/controls";
import { isDragging } from "../../util/helpers";

function getRbdErrorEvent(): Event {
  return new window.ErrorEvent("error", {
    error: new RbdInvariant("my invariant"),
    cancelable: true,
  });
}

it("should abort any active drag (rfd error)", () => {
  const { getByTestId } = render(<App />);

  simpleLift(keyboard, getByTestId("0"));
  expect(isDragging(getByTestId("0"))).toBe(true);
  const event: Event = getRbdErrorEvent();

  act(() => {
    withWarn(() => {
      withError(() => {
        window.dispatchEvent(event);
      });
    });
  });

  // drag aborted
  expect(isDragging(getByTestId("0"))).toBe(false);
  // error event prevented
  expect(event.defaultPrevented).toBe(true);
});

it("should abort any active drag (non-rfd error)", () => {
  const { getByTestId } = render(<App />);
  simpleLift(keyboard, getByTestId("0"));
  expect(isDragging(getByTestId("0"))).toBe(true);
  const event: Event = getRuntimeError();

  // not logging the raw error
  act(() => {
    withoutError(() => {
      // logging that the drag was aborted
      withWarn(() => {
        window.dispatchEvent(event);
      });
    });
  });

  // drag aborted
  expect(isDragging(getByTestId("0"))).toBe(false);
  // error event not prevented
  expect(event.defaultPrevented).toBe(false);
});

import { act, render } from "@testing-library/react";
import type { Position } from "css-box-model";
import React from "react";
import { invariant } from "../../../../../src/invariant";
import { add } from "../../../../../src/state/position";
import type {
  FluidDragActions,
  PreDragActions,
  SensorAPI,
} from "../../../../../src/types";
import App from "../../util/app";
import { getOffset } from "../../util/helpers";

function noop() {}

it("should throttle move events by request animation frame", () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  const { getByText } = render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, "expected api to be set");
  const handle: HTMLElement = getByText("item: 0");

  const preDrag: PreDragActions | null = api.tryGetLock("0", noop);
  invariant(preDrag);

  const initial: Position = { x: 2, y: 3 };
  const actions: FluidDragActions = preDrag.fluidLift(initial);
  // has not moved yet
  expect(getOffset(handle)).toEqual({ x: 0, y: 0 });

  const offset: Position = { x: 1, y: 5 };
  actions.move(add(initial, offset));
  actions.move(add(initial, offset));
  actions.move(add(initial, offset));

  // still not moved
  expect(getOffset(handle)).toEqual({ x: 0, y: 0 });

  // moved after frame
  act(() => {
    requestAnimationFrame.step();
  });
  expect(getOffset(handle)).toEqual(offset);
});

it("should cancel any pending moves after a lock is released", () => {
  const sensor = jest.fn<void, [SensorAPI]>();
  const { getByText } = render(<App sensors={[sensor]} />);
  const api: SensorAPI | undefined = sensor.mock.calls[0]?.[0];
  invariant(api, "expected api to be set");
  const handle: HTMLElement = getByText("item: 0");

  const preDrag: PreDragActions | null = api.tryGetLock("0", noop);
  invariant(preDrag);

  const initial: Position = { x: 2, y: 3 };
  const actions: FluidDragActions = preDrag.fluidLift(initial);
  // has not moved yet
  expect(getOffset(handle)).toEqual({ x: 0, y: 0 });

  const offset: Position = { x: 1, y: 5 };
  actions.move(add(initial, offset));
  // not moved yet
  expect(getOffset(handle)).toEqual({ x: 0, y: 0 });

  actions.cancel();

  // will not do anything
  requestAnimationFrame.step();
  expect(getOffset(handle)).toEqual({ x: 0, y: 0 });
});

import { useReducer, useCallback, Dispatch, useMemo } from "react";

enum ActionType {
  Undo,
  Redo,
  Set,
  ClearHistory,
}

export type EditorHistory = {
  /**
   * no-op if you can't undo
   * @param permanent If true, after the undo you won't be able to redo that change
   */
  undo(permanent?: boolean): void;
  /** no-op if you can't redo */
  redo(): void;
  /** doesn't change the current state, but does clear all the prev/next states */
  clearHistory(): void;
  /** either false, or the annotation of the action you will be be undoing next. */
  canUndo: false | string;
  /** either false, or the annotation of the action you will be be reodoing next.  */
  canRedo: false | string;
  /** whether anything has changed at all. If false, we are still at the initial state */
  anyChanges: boolean;
};

// TODO: potential improvements:
//  - a reset action
//  - setStates which are not annotated are silently skipped when you undo/redo
//    e.g. https://github.com/facebookincubator/RapiD/blob/d59edfdb/modules/core/history.js#L215
//  - support saving and restoring history to localstorage

type Annotated<T> = {
  annotation: string;
  value: T;
  /**
   * `consolidate` means this change will be merged together with the previous one if they have
   * the same annotation. This means there will only be one history item for the consequetive
   * changes with the same annotation.
   */
  consolidate?: boolean;
};

/** an annotated new value */
export type NewValue<T> = Annotated<T> | ((previousState: T) => Annotated<T>);
/** the equivilant of {@link SetState} for this hook */
export type SetEditorState<T> = (newValue: NewValue<T>) => void;

type Action<T> = {
  type: ActionType;
  /** only used by undo. If true, after the undo you won't be able to redo that change */
  permanent?: boolean;
  newValueOrFunc?: NewValue<T>;
  transformer?(value: T): T;
};
type State<T> = {
  prev?: State<T>;
  current: Annotated<T>;
  next?: State<T>;
};

const reducer = <T>(previousState: State<T>, action: Action<T>): State<T> => {
  const { prev, current, next } = previousState;

  switch (action.type) {
    case ActionType.ClearHistory: {
      return { prev: undefined, current, next: undefined };
    }

    case ActionType.Undo: {
      if (!prev) return previousState;

      return {
        prev: prev.prev,
        current: prev.current,
        next: action.permanent ? undefined : previousState,
      };
    }

    case ActionType.Redo: {
      if (!next) return previousState;

      return {
        prev: previousState,
        current: next.current,
        next: next.next,
      };
    }

    case ActionType.Set: {
      const newValue =
        typeof action.newValueOrFunc === "function"
          ? action.newValueOrFunc(current.value)
          : action.newValueOrFunc!;

      // prevent pointless changes, this is also an escape hatch if you need
      // to call setState before you know whether a change is required.
      if (newValue.value === current.value) return previousState;

      const finalNewValue = action.transformer
        ? { ...newValue, value: action.transformer(newValue.value) }
        : newValue;

      return {
        prev:
          newValue.consolidate && current.annotation === newValue.annotation
            ? prev
            : previousState,
        current: finalNewValue,
        next: undefined,
      };
    }

    default: {
      throw new Error("Invalid reducer action");
    }
  }
};

/**
 * the API is nearly the same as `useState`, but you get a third argument,
 * which lets you do `undo`/`redo`.
 *
 * Another difference is that every `setState` call needs an annotation,
 * so that the history dialog can be more helpful. Anotations are a string
 * in the past-tense (e.g. "Deleted a rule")
 *
 *
 * @param transformer - You can supply a transformer function, which transforms
 *                      the input that you pass to setState, before saving it as
 *                      the current state.
 *
 * @param beganWithChanges if true, `anyChanges` is set to true, even if there is no
 *                         edit history. You should use this if the user started by
 *                         recovering their changes from localStorage.
 */
export const useEditorHistory = <T>(
  initialState: T,
  transformer?: (value: T) => T,
  beganWithChanges?: boolean
): [value: T, setValue: SetEditorState<T>, history: EditorHistory] => {
  const [state, dispatch] = useReducer(reducer, {
    prev: undefined,
    next: undefined,
    current: { annotation: " ", value: initialState },
  }) as [State<T>, Dispatch<Action<T>>];

  const canUndo = state.prev ? state.current.annotation : false;
  const canRedo = state.next ? state.next.current.annotation : false;
  const anyChanges = beganWithChanges || !!canUndo;

  const undo = useCallback(
    (permanent?: boolean) => dispatch({ type: ActionType.Undo, permanent }),
    []
  );
  const redo = useCallback(() => dispatch({ type: ActionType.Redo }), []);
  const clearHistory = useCallback(
    () => dispatch({ type: ActionType.ClearHistory }),
    []
  );

  const set = useCallback(
    (newValueOrFunction: NewValue<T>) =>
      dispatch({
        type: ActionType.Set,
        newValueOrFunc: newValueOrFunction,
        transformer,
      }),
    [transformer]
  );

  const history = useMemo<EditorHistory>(
    () => ({ undo, redo, canUndo, canRedo, anyChanges, clearHistory }),
    [undo, redo, canUndo, canRedo, anyChanges, clearHistory]
  );

  return [state.current.value, set, history];
};

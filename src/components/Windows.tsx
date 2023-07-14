import { MouseEventHandler, createContext, useCallback, useState } from "react";
import classes from "./Windows.module.scss";

// by default, 70% of the screen size is for the main content
const getDefaultWidth = () => window.innerWidth * 0.7;

/** exposes the stable width of the main window */
export const WindowContext = createContext(0);

export const Windows: React.FC<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}> = ({ children, sidebar }) => {
  // `stableWidth` is only changed when the user finishes dragging.
  // updating `stableWidth` triggers the map to re-create.
  const [stableWidth, setStableWidth] = useState(getDefaultWidth);

  // `tempWidth` changes as the user drags.
  const [tempWidth, setTempWidth] = useState<number>();

  // if `isDragging` is truthy, it's the initialX
  const [isDragging, setIsDragging] = useState<number>();

  const onDrag = useCallback<MouseEventHandler>(
    (event) => {
      if (isDragging) {
        const delta = event.clientX - isDragging;
        setTempWidth(stableWidth + delta);
      }
    },
    [isDragging, stableWidth]
  );

  const onDragEnd = useCallback<MouseEventHandler>(() => {
    if (isDragging) {
      setIsDragging(undefined);
      setTempWidth(undefined);
      if (tempWidth) setStableWidth(tempWidth);
    }
  }, [isDragging, tempWidth]);

  const finalWidth = tempWidth ?? stableWidth;

  return (
    <WindowContext.Provider value={stableWidth}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={classes.windows}
        onMouseMove={onDrag}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        <main style={{ width: finalWidth }}>{children}</main>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          className={classes.dragHandle}
          role="separator"
          aria-orientation="horizontal"
          onMouseDown={(event) => setIsDragging(event.clientX)}
        />
        <aside>{sidebar}</aside>
      </div>
    </WindowContext.Provider>
  );
};

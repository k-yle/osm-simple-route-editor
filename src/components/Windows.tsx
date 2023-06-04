import { useState } from "react";
import classes from "./Windows.module.scss";

export const Windows: React.FC<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}> = ({ children, sidebar }) => {
  const [width] = useState(80);
  // TODO: allow resize

  return (
    <div className={classes.windows}>
      <main style={{ width: `calc(${width}% - 2px)` }}>{children}</main>
      <div
        className={classes.dragHandle}
        role="separator"
        aria-orientation="horizontal"
      />
      <aside style={{ width: `calc(${100 - width}% - 2px)` }}>{sidebar}</aside>
    </div>
  );
};

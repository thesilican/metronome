import React, { Fragment } from "react";

export const tickSound = `${process.env.PUBLIC_URL}/assets/click.mp3`;

export function Prefetch() {
  return (
    <Fragment>
      <link rel="prefetch" href={tickSound} />
    </Fragment>
  );
}

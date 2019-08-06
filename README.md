# react-scroll-transitions

## Introduction

A small but powerfull module for creating scoll animations. Simply add an array of sections to the component and the render function will parse all the information that you will need.

## Usage

```jsx
import React from "react";
import { render } from "react-dom";
import ScrollTransitions from "react-scroll-transitions";

const Example = () => (
  <ScrollTransitions
    sections={[
      { id: "title" },
      { id: "chapter1" },
      {
        id: "chapter2"
      },
      { id: "end" }
    ]}
    render={(id, transitionData) => (
      <div>
        ID: {id}
        <br />
        Percent: {transitionData.percent.toFixed(2)}
      </div>
    )}
  />
);

render(<Example />, document.getElementById("root"));
```

## Props

### sections

Array of _Objects_:

- **id** (required): _(String)_ Unique id for section
- **height**

### test

When set to `true` renders coloured divs for testing and over-rides the render function.

### render

A function that renders each section `onScroll`.

#### properties

**id:** _String_ (id of the section),

**transitionData**: _Object_

- **isVisible**: boolean - Is the section active
- **isEntering**: boolean - Is the section on the entring transition
- **isLeaving**: boolean - Is the section on the leaving transition
- **percent**: number [0-1] - Percent of section
- **enteringPercent**: number [0-1] - Percent of enter transition (with ease in/out values)
- **leavingPercent**: number [0-1] - Percent of leaving transition (with ease in/out values)
- **transitionPercent**: number [0-1] - Percent of both transitions (without ease in/out values)

  }

sections: {
height?: number;
id: string;
inTransition?: EaseFunction;
outTransition?: EaseFunction;
}[];
test?: boolean;
defaultTransition?:
| "linear"
| "easeQuad"
| "easeCubic"
| "easeQuart"
| "easeQuint";
render?: (
id: string,
{
isVisible,
percent,
isLeaving,
isEntering,
transitionPercent,
enteringPercent,
leavingPercent
}: {
isVisible: boolean;
percent: number;
isLeaving: boolean;
isEntering: boolean;
transitionPercent: number;
enteringPercent: number;
leavingPercent: number;
}
) => any;
dynamicLoading?: boolean;
fixedContainer?: boolean;
transitionSize?: number;
transitionOverlap?: boolean;
padStart?: boolean;
padEnd?: boolean;

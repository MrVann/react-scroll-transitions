# react-scroll-transitions

![version](https://img.shields.io/npm/v/react-scroll-transitions)
![downloads](https://img.shields.io/npm/dw/react-scroll-transitions)
![license](https://img.shields.io/npm/l/react-scroll-transitions)

## Introduction

A small but powerfull module for creating scoll animations. Simply add an array of sections to the component and the render function will parse all the information that you will need.

[Try the demo](https://mrvann.github.io/react-scroll-transitions)

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

## ScrollProsition (component): Props

### sections

Array of _Objects_:

- **id**: _(String)_ Unique id for section
- **height** (optional): _(Number: default = 1)_ The scroll height of each section (1 means 100% of the window height)
- **inTransition** (optional): _(String: default - "linear")_ Option for transition types (see 'transition types')
- **outTransition** (optional): _(String: default - "linear")_ Option for transition types (see 'transition types')

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

### renderAll

A function that renders a component and parses all transition data.

#### allTransitionData (_Object_)

**visibility**: _Array_

Array of ids that are visible.

**positions**: _ObjectArray_

- **isVisible**: boolean - Is the section active
- **isEntering**: boolean - Is the section on the entring transition
- **isLeaving**: boolean - Is the section on the leaving transition
- **percent**: number [0-1] - Percent of section
- **enteringPercent**: number [0-1] - Percent of enter transition (with ease in/out values)
- **leavingPercent**: number [0-1] - Percent of leaving transition (with ease in/out values)
- **transitionPercent**: number [0-1] - Percent of both transitions (without ease in/out values)

### test (optional)

_Default: false_

When set to `true` renders coloured divs for testing and over-rides the render function.

### dynamicLoading (optional)

_Default: true_

Removes each section from the DOM when it isn't visible.

### fixedContainer (optional)

_Default: true_

Renders the `render()` content inside a fixed container for each section.

### transitionSize (optional)

_Default: 0.5_

The size of transitions (0.5 = half of the screen height)

### transitionOverlap (optional)

_Default: false_

Overlaps the transitions, rendering both sections at the same time during each transition.

### padStart (option)

_Default: true_

Pads the start of the page to equal the same duration of scrolling as other sections (you might want to remove this if your animation doesn't begin by entering the frame).

### padEnd (option)

_Default: true_

Pads the end of the page to equal the same duration of scrolling as other sections (you might want to remove this if your animation doesn't end by leaving the frame).

## getScrollTransition (Function): Parameters

### _Object_

- **percent** : (number: [0-1]) The value of the section percent.
- **from** : (number: [0-1]) Start value of the section transition.
- **to** : (number: [0-1]) End value of the section transition.
- **transition** : (string: TransitionType) Transition type.
- **reverse** : (boolean) Reverse the direction (0 to 1 becomes 1 to 0).

## Transition types

Thanks to [Gaëtan Renaudeau](https://gist.github.com/gre).

Options:

- **linear** : No easing, no acceleration
- **easeIn** : Accelerating from zero velocity
- **easeOut** : Decelerating to zero velocity
- **easeInOut** : Acceleration until halfway, then deceleration
- **solid** : 1 when higher than 0.00

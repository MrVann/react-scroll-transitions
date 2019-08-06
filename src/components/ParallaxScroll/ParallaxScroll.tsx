import React from "react";

type EaseFunction =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint";

interface SafeSection {
  height: number;
  id: string;
  inTransition: EaseFunction;
  outTransition: EaseFunction;
}

export interface ParallaxScrollComponentProps {
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
}

interface IScrollMeta {
  height: number;
  id: string;
  startPosition: number;
  endPosition: number;
  transitionInEnd: number;
  transitionOutStart: number;
}

export const ParallaxScroll: React.FC<ParallaxScrollComponentProps> = ({
  sections,
  test = false,
  render,
  dynamicLoading = true,
  fixedContainer = true,
  transitionSize = 0.5,
  transitionOverlap = false,
  padStart = true,
  padEnd = true
}) => {
  const [safeSections, setSections] = React.useState([] as SafeSection[]);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [scrollMeta, setScrollMeta] = React.useState([] as IScrollMeta[]);
  const [positionList, setPositionList] = React.useState([] as {
    id: string;
    percent: number;
    isLeaving: boolean;
    isEntering: boolean;
    transitionPercent: number;
    enteringPercent: number;
    leavingPercent: number;
  }[]);
  const [visibleList, setVisibleList] = React.useState([] as string[]);

  React.useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [scrollMeta, scrollHeight]);

  const onScroll = (ev: any, newScrollMeta?: IScrollMeta[]) => {
    const newScrollTop = ev.target.scrollingElement.scrollTop;
    const newVisible = (newScrollMeta ? newScrollMeta : scrollMeta)
      .filter(
        section =>
          section.startPosition <= newScrollTop &&
          section.endPosition >= newScrollTop
      )
      .map(section => section.id);
    const newPositions = (newScrollMeta ? newScrollMeta : scrollMeta).map(
      section => {
        const isVisible =
          section.startPosition <= newScrollTop &&
          section.endPosition >= newScrollTop;
        const range = section.endPosition - section.startPosition;
        const progress = newScrollTop - section.startPosition;
        const transitionRange = section.transitionInEnd - section.startPosition;
        const isEntering =
          newScrollTop >= section.startPosition &&
          newScrollTop <= section.transitionInEnd;
        const isLeaving =
          newScrollTop >= section.transitionOutStart &&
          newScrollTop <= section.endPosition;
        const enteringPercent = isEntering
          ? (newScrollTop - section.startPosition) / transitionRange
          : newScrollTop >= section.transitionInEnd
          ? 1
          : 0;
        const leavingPercent = isLeaving
          ? -(newScrollTop - section.endPosition) / transitionRange
          : newScrollTop <= section.transitionOutStart
          ? 1
          : 0;
        const transitionPercent =
          isVisible && !isEntering && !isLeaving
            ? 1
            : isLeaving
            ? leavingPercent
            : enteringPercent;
        return {
          id: section.id,
          percent: progress / range,
          isEntering,
          isLeaving,
          transitionPercent,
          enteringPercent,
          leavingPercent
        };
      }
    );
    setPositionList(newPositions);
    setVisibleList(newVisible);
    setScrollHeight(newScrollTop);
  };

  React.useEffect(() => {
    const tempSafeSections = sections.map((section, index) => ({
      ...section,
      inTransition:
        section.inTransition &&
        Object.keys(easingFunctions).includes(section.inTransition)
          ? section.inTransition
          : "linear",
      outTransition:
        section.outTransition &&
        Object.keys(easingFunctions).includes(section.outTransition)
          ? section.outTransition
          : "linear",
      height:
        (section.height || 1) +
        ((index == 0 && padStart) || (index === sections.length - 1 && padEnd)
          ? 1
          : 0),
      startPosition: 0
    })) as any[];

    const newScrollMeta = tempSafeSections.map((section, index) => {
      const isFirst = index === 0;
      const isLast = index === tempSafeSections.length - 1;
      const windowHeight = window.innerHeight;

      const transitionRange = transitionOverlap
        ? windowHeight * (transitionSize * 2)
        : (windowHeight * (transitionSize * 2)) / 2;

      const halfWindow = windowHeight / 2;

      const transitionEnterOffset = transitionOverlap
        ? 0
        : isFirst
        ? 0
        : halfWindow;

      const transitionLeaveOffset = transitionOverlap
        ? 0
        : isLast || isFirst
        ? -halfWindow
        : 0 - halfWindow - halfWindow;

      const startPosition = isFirst
        ? 0
        : tempSafeSections
            .filter((_xsection, xindex) => xindex < index)
            .map(xsection => xsection.height)
            .reduce((total, val) => total + val) *
            windowHeight -
          windowHeight +
          transitionEnterOffset;

      const endPosition =
        isFirst || isLast
          ? isLast
            ? startPosition +
              windowHeight * section.height +
              transitionLeaveOffset
            : startPosition +
              windowHeight * section.height +
              transitionLeaveOffset
          : startPosition +
            windowHeight * section.height +
            windowHeight +
            transitionLeaveOffset;

      const transitionInEnd = startPosition + transitionRange;
      const transitionOutStart = endPosition - transitionRange;

      return {
        ...section,
        startPosition: startPosition || 0,
        endPosition,
        transitionInEnd,
        transitionOutStart
      };
    });
    setScrollMeta(newScrollMeta);
    setSections(tempSafeSections);
    onScroll({ target: { scrollingElement: { scrollTop: 0 } } }, newScrollMeta);
  }, []);
  return (
    <>
      {safeSections.map((section, index) => {
        const position = positionList.find(
          sectionx => section.id == sectionx.id
        );

        const enteringPercent = easingFunctions[section.inTransition](
          (position && position.enteringPercent) || 0
        );
        const leavingPercent =
          1 -
          easingFunctions[section.outTransition](
            1 - ((position && position.leavingPercent) || 0)
          );
        const percent = (position && position.percent) || 0;
        const isEntering = (position && position.isEntering) || false;
        const isLeaving = (position && position.isLeaving) || false;
        const transitionPercent = (position && position.transitionPercent) || 0;

        return (
          <div
            key={index}
            id={section.id}
            style={{
              height: `${section.height * 100 - (index == 0 ? 0 : 0)}vh`,
              backgroundColor: test
                ? index % 2 == 1
                  ? "rgb(255,20,200)"
                  : "rgb(20,200,255)"
                : "none"
            }}
          >
            {test && `${section.id} - ${position && position.percent}`}
            {test ? (
              <div
                style={{
                  ...styles.fixedContainer,
                  display: visibleList.includes(section.id) ? "block" : "none",
                  opacity: 0.5,
                  paddingTop: index * 100,
                  backgroundColor:
                    index % 2 == 1 ? "rgb(255,200,200)" : "rgb(200,200,255)",
                  height: `${section.height ? section.height * 100 : 100}vh`
                }}
              >
                {section.id} - {position && position.percent}
              </div>
            ) : !fixedContainer ? (
              render &&
              (!dynamicLoading || visibleList.includes(section.id)) &&
              render(section.id, {
                isVisible: visibleList.includes(section.id),
                percent: percent,
                isEntering: isEntering,
                isLeaving: isLeaving,
                transitionPercent: transitionPercent,
                enteringPercent: enteringPercent,
                leavingPercent: leavingPercent
              })
            ) : (
              (!dynamicLoading || visibleList.includes(section.id)) && (
                <div
                  style={{
                    ...styles.fixedContainer,
                    height: `100vh`
                  }}
                >
                  {render &&
                    render(section.id, {
                      isVisible: visibleList.includes(section.id),
                      percent: percent,
                      isEntering: isEntering,
                      isLeaving: isLeaving,
                      transitionPercent: transitionPercent,
                      enteringPercent: enteringPercent,
                      leavingPercent: leavingPercent
                    })}
                </div>
              )
            )}
          </div>
        );
      })}
    </>
  );
};

const styles = {
  fixedContainer: {
    position: "fixed",
    width: "100%",
    top: "0px",
    left: "0px"
  } as React.CSSProperties
};

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const easingFunctions = {
  // no easing, no acceleration
  linear: function(t: number) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function(t: number) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function(t: number) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function(t: number) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function(t: number) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function(t: number) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function(t: number) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t: number) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function(t: number) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function(t: number) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t: number) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

import React from "react";

type EaseFunction = "linear" | "easeIn" | "easeOut" | "easeInOut" | "solid";

export interface SafeSection {
  height: number;
  id: string;
  inTransition: EaseFunction;
  outTransition: EaseFunction;
}

export interface SectionInformation {
  isVisible: boolean;
  percent: number;
  isLeaving: boolean;
  isEntering: boolean;
  transitionPercent: number;
  enteringPercent: number;
  leavingPercent: number;
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
  render?: (id: string, transitionData: SectionInformation) => any;
  renderAll?: (transitionData: {
    visibility: string[];
    positions: SectionInformation[];
  }) => any;
  dynamicLoading?: boolean;
  fixedContainer?: boolean;
  transitionSize?: number;
  transitionOverlap?: boolean;
  padStart?: boolean;
  padEnd?: boolean;
}

export interface IScrollMeta {
  height: number;
  id: string;
  startPosition: number;
  endPosition: number;
  transitionInEnd: number;
  transitionOutStart: number;
}

export const getScrollTransition = ({
  percent: parentPercent,
  from,
  to,
  transition,
  reverse
}: {
  percent: number;
  from: number;
  to: number;
  transition?: EaseFunction;
  reverse?: boolean;
}) => {
  const range = to - from;
  const progress = parentPercent - from;
  const active = parentPercent >= from && parentPercent <= to;
  const percent = active ? progress / range : 0;
  const finalTransition =
    reverse &&
    transition &&
    transition.startsWith("ease") &&
    transition !== "easeInOut"
      ? transition === "easeIn"
        ? "easeOut"
        : "easeIn"
      : transition;
  return finalTransition
    ? transitionFunctions[finalTransition](percent)
    : percent;
};

export const ParallaxScroll: React.FC<ParallaxScrollComponentProps> = ({
  sections,
  test = false,
  render,
  dynamicLoading = true,
  fixedContainer = true,
  transitionSize = 0.5,
  transitionOverlap = false,
  padStart = true,
  padEnd = true,
  renderAll
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
        Object.keys(transitionFunctions).includes(section.inTransition)
          ? section.inTransition
          : "linear",
      outTransition:
        section.outTransition &&
        Object.keys(transitionFunctions).includes(section.outTransition)
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
      {renderAll ? (
        renderAll({
          visibility: visibleList,
          positions: safeSections.map(section => {
            const position = positionList.find(
              sectionx => section.id == sectionx.id
            );

            const enteringPercent = transitionFunctions[section.inTransition](
              (position && position.enteringPercent) || 0
            );
            const leavingPercent =
              1 -
              transitionFunctions[section.outTransition](
                1 - ((position && position.leavingPercent) || 0)
              );
            const percent = (position && position.percent) || 0;
            const isEntering = (position && position.isEntering) || false;
            const isLeaving = (position && position.isLeaving) || false;
            const transitionPercent =
              (position && position.transitionPercent) || 0;

            return {
              isVisible: visibleList.includes(section.id),
              percent: percent,
              isEntering: isEntering,
              isLeaving: isLeaving,
              transitionPercent: transitionPercent,
              enteringPercent: enteringPercent,
              leavingPercent: leavingPercent
            } as SectionInformation;
          })
        })
      ) : (
        <> </>
      )}
      {safeSections.map((section, index) => {
        const position = positionList.find(
          sectionx => section.id == sectionx.id
        );

        const enteringPercent = transitionFunctions[section.inTransition](
          (position && position.enteringPercent) || 0
        );
        const leavingPercent =
          1 -
          transitionFunctions[section.outTransition](
            1 - ((position && position.leavingPercent) || 0)
          );
        const percent = (position && position.percent) || 0;
        const isEntering = (position && position.isEntering) || false;
        const isLeaving = (position && position.isLeaving) || false;
        const transitionPercent = (position && position.transitionPercent) || 0;
        const isUnderscroll = index === 0 && scrollHeight < 0;
        const isOverscroll =
          index === safeSections.length - 1 &&
          scrollHeight > scrollMeta[index].endPosition;

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
              (!dynamicLoading ||
                (visibleList.includes(section.id) || isUnderscroll)) &&
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
              (!dynamicLoading ||
                visibleList.includes(section.id) ||
                isUnderscroll ||
                isOverscroll) && (
                <div
                  style={{
                    ...styles.fixedContainer,
                    height: `100vh`
                  }}
                >
                  {render &&
                    render(section.id, {
                      isVisible:
                        visibleList.includes(section.id) ||
                        isUnderscroll ||
                        isOverscroll,
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
const transitionFunctions = {
  // no easing, no acceleration
  linear: (t: number) => {
    return t;
  },
  // Quad: accelerating from zero velocity
  easeIn: (t: number) => {
    return t * t;
  },
  // Quad: decelerating to zero velocity
  easeOut: (t: number) => {
    return t * (2 - t);
  },
  // Quad: acceleration until halfway, then deceleration
  easeInOut: (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  /*
   * Additional functions
   */
  solid: (t: number) => {
    return t > 0 && t < 1 ? 1 : 0;
  }
};

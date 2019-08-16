import React, { Component } from "react";
import jackDanceGif from "./assets/jack-dance.gif";
import girlfriendGif from "./assets/girlfriend.gif";
// import styled from "styled-components";

import ParallaxScroll, { getScrollTransition } from "./reactComponentLib";
import { blockStatement } from "@babel/types";

// const StyledDiv = styled.div`
//   padding: 10px;
//   background-color: blue;
//   color: white;
// `;

class App extends Component {
  render() {
    return (
      <div>
        <ParallaxScroll
          test={false}
          padStart={true}
          padEnd={true}
          transitionOverlap={false}
          transitionSize={0.5}
          sections={[
            { id: "title", height: 2, outTransition: "easeIn" },
            { id: "chapter1", height: 2 },
            {
              id: "chapter2",
              height: 2,
              inTransition: "easeOut",
              outTransition: "easeIn"
            },
            {
              id: "chapter3",
              height: 2
            },
            { id: "end", height: 2 }
          ]}
          renderAll={transitionData => {
            console.log(
              "render all",
              transitionData,
              transitionData.visibility.includes("chapter2"),
              transitionData.visibility.includes("chapter3")
            );
            if (
              transitionData.visibility.includes("chapter2") ||
              transitionData.visibility.includes("chapter3")
            ) {
              return (
                <div
                  style={{
                    position: "fixed",
                    left: "0px",
                    top: "0px",
                    margin: "10px",
                    textAlign: "center"
                  }}
                >
                  <img
                    src={girlfriendGif}
                    style={{
                      position: "static",
                      // right: "0px",
                      display: "block",
                      objectFit: "cover",
                      width: "200px",
                      height: "200px",
                      borderRadius: "100%",
                      margin: "10px"
                      // bottom: "20px"
                    }}
                  />
                  Staying for longer than normal
                </div>
              );
            }
          }}
          render={(
            id,
            {
              percent,
              isLeaving,
              isEntering,
              transitionPercent,
              leavingPercent,
              enteringPercent,
              isVisible
            }
          ) => {
            switch (id) {
              case "title": {
                return (
                  <div
                    style={{
                      position: "fixed",
                      left: "50%",
                      opacity: isLeaving ? transitionPercent : 1,
                      color: `rgb(0, ${0 + (1 - percent) * 225},${225 -
                        (1 - percent) * 225})`,
                      fontSize: 50,
                      top: `${50 - (1 - leavingPercent) * 50}%`,
                      transform: `translate(-50%, -50%) rotate(${0 +
                        (1 - leavingPercent) * 40}deg)`,
                      textAlign: "center"
                    }}
                  >
                    Welcome to
                    <br />
                    <span
                      style={{
                        color: "rgb(218,37,3)",
                        textShadow: `-1px -1px 0 #000,  
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                         1px 1px 0 #000`
                      }}
                    >
                      <b>react-scroll-transitions</b>
                    </span>
                    <br />
                    {(percent * 100).toFixed(0)}%
                  </div>
                );
              }
              case "chapter1": {
                return (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      opacity: isLeaving
                        ? leavingPercent
                        : isEntering
                        ? enteringPercent
                        : 1,
                      left: `50%`,
                      transform: `translate(-50%, -50%) rotate(${5 -
                        (1 - percent) * 10}deg)`,
                      fontSize: "20px"
                    }}
                  >
                    <h3>
                      <b>Full</b> control over transitions
                    </h3>
                    <table>
                      <tr>
                        <td>
                          <b>id</b>
                        </td>
                        <td>{id}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>percent</b>
                        </td>
                        <td>{percent.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>enteringPercent</b>
                        </td>
                        <td>{enteringPercent.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>leavingPercent</b>
                        </td>
                        <td>{leavingPercent.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>transitionPercent</b>
                        </td>
                        <td>{transitionPercent.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>isEntering</b>
                        </td>
                        <td>{isEntering ? "true" : "false"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>isLeaving</b>
                        </td>
                        <td>{isLeaving ? "true" : "false"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>isVisible</b>
                        </td>
                        <td>{isVisible ? "true" : "false"}</td>
                      </tr>
                    </table>
                  </div>
                );
              }
              case "chapter2": {
                return (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        opacity: 1,
                        fontSize: "50px",
                        textAlign: "center",
                        fontWeight: 900,
                        top: `${20 +
                          30 *
                            (isEntering
                              ? enteringPercent * 1
                              : isLeaving
                              ? leavingPercent * 1
                              : 1)}%`,
                        transform: `translate(-50%, -50%) rotate(${20 -
                          percent * 40}deg) scale(${
                          isEntering
                            ? enteringPercent * 1
                            : isLeaving
                            ? leavingPercent * 1
                            : 1
                        })`
                      }}
                    >
                      Use easing transitions!
                    </div>
                  </>
                );
              }
              case "chapter3": {
                const jackTransition1 = getScrollTransition({
                  percent,
                  from: 0.2,
                  to: 0.8,
                  transition: "easeInOut"
                });
                const jackTransition2 = getScrollTransition({
                  percent,
                  from: 0.5,
                  to: 1,
                  transition: "easeInOut"
                });
                return (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        opacity: transitionPercent,
                        fontSize: "50px",
                        fontWeight: 900,
                        top: `50%`,
                        transform: `translate(-50%, -50%)`
                      }}
                    >
                      Split transitions!
                    </div>
                    {jackTransition2 ? (
                      <img
                        src={jackDanceGif}
                        style={{
                          position: "fixed",
                          left: `${100 * jackTransition2}%`,
                          transform: `translateX(-${100 -
                            100 * jackTransition2}%)`,
                          top: `${jackTransition2 * 30}%`
                        }}
                      />
                    ) : (
                      ""
                    )}
                    {jackTransition1 ? (
                      <img
                        src={jackDanceGif}
                        style={{
                          position: "fixed",
                          right: `${100 * jackTransition1}%`,
                          transform: `translateX(${100 -
                            100 * jackTransition1}%)`,
                          bottom: "20px"
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </>
                );
              }
              case "end": {
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      opacity: 1,
                      fontSize: "50px",
                      // fontWeight: 800,
                      top: `${100 - percent * 50}%`,
                      transform: `translate(-50%, -50%) rotate(${-180 +
                        percent * 180}deg) scale(${0 + percent * 1})`
                    }}
                  >
                    <span
                      style={{
                        color: "rgb(255,221, 3)",
                        textShadow: `-1px -1px 0 #000,  
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                         1px 1px 0 #000`
                      }}
                    >
                      <b>Star</b>
                    </span>{" "}
                    <a
                      href={
                        "https://github.com/MrVann/react-scroll-transitions"
                      }
                    >
                      this Repo!!
                    </a>
                  </div>
                );
              }
            }
          }}
        />
      </div>
    );
  }
}

export default App;

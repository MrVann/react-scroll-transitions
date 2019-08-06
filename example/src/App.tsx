import React, { Component } from "react";
// import styled from "styled-components";

import ParallaxScroll from "./reactComponentLib";

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
          padStart={false}
          padEnd={false}
          transitionOverlap={false}
          transitionSize={2}
          sections={[
            { id: "title", height: 2, outTransition: "easeOutQuad" },
            { id: "chapter1", height: 2 },
            {
              id: "chapter2",
              height: 2,
              inTransition: "easeOutCubic",
              outTransition: "easeOutCubic"
            },
            { id: "end", height: 2 }
          ]}
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
                      position: "absolute",
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
                      right: `${70 - percent * 60}%`,
                      transform: `translate(-50%, -50%) rotate(${5 -
                        percent * 10}deg)`,
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
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      opacity: 1,
                      fontSize: "50px",
                      fontWeight: 900,
                      top: `${20 +
                        30 *
                          (isEntering
                            ? enteringPercent * 1
                            : isLeaving
                            ? leavingPercent * 1
                            : 1)}%`,
                      // top: `${100 - percent * 100}%`,
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
                );
              }
              case "end": {
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      opacity: 1,
                      fontSize: "30px",
                      // fontWeight: 800,
                      top: `${100 - percent * 50}%`,
                      transform: `translate(-50%, -50%) rotate(${-180 +
                        percent * 180}deg) scale(${1 + percent * 3})`
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
                    this Repo!!
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

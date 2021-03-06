import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";
import "bulma/css/bulma.css";
// import "@mdi/font/css/materialdesignicons.css"

import SiteHeader from "./lib/components/SiteHeader";
import Container from "./lib/components/Container";

import RobotSearch from "./features/robots/robot-search/RobotSearch";
import Dashboard from "./features/dashboard/Dashboard";
import { departments, jobTitles, INITIAL_ROBOTS } from "./data";

const robotReducer = (state, action) => {
  switch (action.type) {
    case "SAVE": {
      // We want to pluck off only the properties that make up a robot
      // not the derived values, or anything else that may have accidently
      // ended up in the action
      let { id, name, username, email, jobTitleId, active } = action.robot;
      return state.map(robot => {
        return robot.id !== action.robot.id
          ? robot
          : { id, name, username, email, jobTitleId, active };
      });
    }
    case "ACTIVATE":
      return state.map(robot =>
        robot.id !== action.id ? robot : { ...robot, active: true }
      );
    case "DEACTIVATE":
      return state.map(robot =>
        robot.id !== action.id ? robot : { ...robot, active: false }
      );
    default:
      return state;
  }
};

const robotFactory = (departments, jobTitles) => robot => {
  let jobTitle = jobTitles.find(title => title.id === robot.jobTitleId);
  let department = departments.find(
    department => department.id === jobTitle.departmentId
  );

  return {
    ...robot,
    jobTitle: jobTitle.text,
    departmentId: department.id,
    department: department.text
  };
};
const robotBuilder = robotFactory(departments, jobTitles);
function App() {
  let [robotParts, robotDispatch] = useReducer(robotReducer, INITIAL_ROBOTS);

  let robots = robotParts.map(robotBuilder);
  return (
    <>
      <SiteHeader />
      <Container>
        <Router primary={false}>
          <Dashboard
            path="/"
            departments={departments}
            jobTitles={jobTitles}
            robots={robots}
          />
          <RobotSearch
            path="/robots"
            departments={departments}
            jobTitles={jobTitles}
            robots={robots}
            robotDispatch={robotDispatch}
          />
        </Router>
      </Container>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from "react-router-dom";

// import { FooterComponent } from "./components/footer/Footer";

import { routePath } from "./routelink";
import { Protected } from "./app/proteched.route";
import { Login } from './pages/login/Login';
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Users } from "./pages/users/Users";
import { UserProfile } from "./pages/users/userForm/UserForm";
import { TimeTracked } from "./pages/users/TimeTracker/TimeTracker";
import { Projects } from "./pages/projects/Projects";
import { Project } from "./pages/project/Project";
import { Tasks } from "./pages/project/tasks/Tasks";

import { Clients } from "./pages/clients/Clients";
import { Leaves } from "./pages/leaves/Leaves";

import { Reports } from "./pages/reports/Reports";
import { TimeTrackReport } from "./pages/reports/TimeTrack/TimeTrack";

// import { TaskDetail } from "./pages/tasks/detail/details";
import { TaskDetail } from "./pages/project/tasks/detail/details";
import { Backlog } from "./pages/project/backlog/Backlog";

import { Policy } from "./pages/policy/Policy";
import { HrApp } from "./pages/hrapp/Hrapp";
import { Profiles } from "./pages/hrapp/profiles/Profiles";
import { Candidates } from "./pages/hrapp/candidates/Candidates";
import { Questions } from "./pages/hrapp/questions/Questions";

import { Career } from "./pages/career/Career";
import { CareerLanding } from "./pages/career/landing/Landing";
import { CareerApply } from "./pages/career/apply/Apply";
import { CareerExam } from "./pages/career/exam/Exam";
import { CareerResult } from "./pages/career/result/Result";
import { loading } from './components/loader/FullPageLoader';
import { selectIsLoading } from './components/loader/FullPageLoaderSlice';
import { useSelector } from 'react-redux';

import { ToastComp } from "./components/toast/Toast";

import './App.scss';
// import bg from './assets/images/bg.svg';


function App() {
  const isLoading = useSelector(selectIsLoading)
  return (
    <>
      {isLoading && loading}
      {/* <div class="ribbon"><span>BETA</span></div> */}
      <ToastComp />
      <Router>
        <Routes>
          <Route exact path={routePath.dashboard} element={<Protected> <Dashboard /></Protected>}> </Route>
          <Route exact path={routePath.users} element={<Protected> <Users /></Protected>}> </Route>
          <Route exact path={routePath.reports}
            element={<Protected> <Reports /></Protected>}>
            {/* <Route index element={<CareerLanding />} /> */}
            <Route path="time-spent" element={<TimeTrackReport />} />
            <Route path={'activity'} element={<TimeTracked />} />
          </Route>
          <Route exact path={routePath.project}
            element={<Protected> <Project /></Protected>}>
            <Route path=":taskPrefix/backlog" element={<Backlog />} />
            <Route path=":taskPrefix/board" element={<Tasks />} />
            <Route path=":taskPrefix/task/:task_id" element={<TaskDetail />} />
          </Route>
          <Route exact path={routePath.projects} element={<Protected> <Projects /></Protected>}> </Route>
          <Route exact path={routePath.clients} element={<Protected> <Clients /></Protected>}> </Route>
          <Route exact path={routePath.leaves} element={<Protected> <Leaves /></Protected>}> </Route>
          {/* <Route exact path={routePath.tasks} element={<Protected> <Tasks /></Protected>}> </Route> */}
          <Route exact path={routePath.taskdetail} element={<Protected> <TaskDetail /></Protected>}> </Route>
          <Route exact path={routePath.vacancy} element={<Protected> <HrApp > <Profiles /> </HrApp> </Protected>}> </Route>
          <Route exact path={routePath.candidates} element={<Protected> <HrApp > <Candidates /> </HrApp> </Protected>}> </Route>
          <Route exact path={routePath.policy} element={<Protected> <HrApp > <Policy /></HrApp> </Protected>}> </Route>
          <Route exact path={routePath.questions} element={<Protected> <HrApp > <Questions /></HrApp> </Protected>}> </Route>
          <Route exact path={routePath.profile} element={<Protected> <UserProfile /> </Protected>}> </Route>

          <Route path={routePath.login} element={<Login />}></Route>
          <Route path={routePath.career} element={<Career />}>
            <Route index element={<CareerLanding />} />
            <Route path="apply" element={<CareerApply />} />
            <Route path="exam" element={<CareerExam />} />
            <Route path="result/:cadId" element={<CareerResult />} />
          </Route>
          <Route path="/*" element={<Navigate to={'/dashboard'} />}></Route>
        </Routes>
      </Router>
      {/* <FooterComponent /> */}
    </>
  );
}

export default App;
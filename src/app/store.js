import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../pages/counter/counterSlice';
import loginReducer from '../pages/login/loginSlice';
import usersReducer from '../pages/users/usersSlice';
import timeTrackerReducer from '../pages/users/TimeTracker/TimeTrackerSlice';
import projectsReducer from '../pages/projects/projectsSlice';
import tasksReducer from '../pages/project/tasks/tasksSlice';
import addTaskReducer from '../pages/project/tasks/add/AddTasksSlice';
import clientsReducer from '../pages/clients/clientsSlice';
import leavesReducer from '../pages/leaves/leaveSlice';
// import tasksReducer from '../pages/tasks/tasksSlice';

import masterReducer from "../services/master/masterSlice";
import userformReducer from '../pages/users/userForm/userFormSlice';
import projectformReducer from '../pages/projects/projectForm/projectFormSlice';
import clientformReducer from '../pages/clients/clientForm/clientFormSlice';
import leaveformReducer from '../pages/leaves/leaveForm/leaveFormSlice';
// import addTaskReducer from '../pages/tasks/add/AddTasksSlice';
import dashboardReducer from '../pages/dashboard/dashboardSlice';

import hrappReducer from '../pages/hrapp/hrappSlice';
import profilesReducer from '../pages/hrapp/profiles/profilesSlice';
import vacancyReducer from '../pages/hrapp/vacancy/vacancySlice';
import candidatesReducer from '../pages/hrapp/candidates/candidatesSlice';
import interviewReducer from '../pages/hrapp/interview/interviewSlice';
import holidaysReducer from '../pages/hrapp/holidays/holidaysSlice';
import questionsReducer from '../pages/hrapp/questions/questionsSlice';
import hirecareerReducer from '../pages/career/careerSlice';
import loadingReducer from '../components/loader/FullPageLoaderSlice';

//Reportss
import reportsReducer from "../pages/reports/reportsSlice";

import toastCompReducer from "../components/toast/toastSlise";

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    login: loginReducer,
    userform: userformReducer,
    master: masterReducer,
    users: usersReducer,
    projects: projectsReducer,
    projectform: projectformReducer,
    clients: clientsReducer,
    clientform: clientformReducer,
    leaves: leavesReducer,
    leaveform: leaveformReducer,
    tasks: tasksReducer,
    addtask: addTaskReducer,
    dash: dashboardReducer,
    hrapp: hrappReducer,
    profiles: profilesReducer,
    vacancy: vacancyReducer,
    candidates: candidatesReducer,
    interview: interviewReducer,
    holidays: holidaysReducer,
    questions: questionsReducer,
    hirecareer: hirecareerReducer,
    toastcomp: toastCompReducer,
    timetracked: timeTrackerReducer,
    loading: loadingReducer,
    reports: reportsReducer
  },
});

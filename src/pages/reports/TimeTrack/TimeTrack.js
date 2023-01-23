import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './TimeTrack.scss';
import { selectLeaves } from "../../../pages/leaves/leaveSlice"
import {
    listUsersReportAsync, selectActivity, selectUser, selectLeaveData,
    changeTsMonth, changeTsYear, selectTsMonth, selectTsYear
} from "../reportsSlice";
import { Stack } from 'react-bootstrap';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { IoIosRefreshCircle } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { FaHome } from "react-icons/fa";

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth = (month, year) => {
    month = month - 1;
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        let dd = new Date(date);
        let m = `0${dd.getMonth() + 1}`.slice(-2);
        let d = `0${dd.getDate()}`.slice(-2);
        let date1 = { date: `${dd.getFullYear()}-${m}-${d}`, day: weekDays[dd.getDay()] }
        days.push(date1);
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export const TimeTrackReport = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUser);
    const activity = useSelector(selectActivity);
    const leaveData = useSelector(selectLeaveData);
    const month = useSelector(selectTsMonth);
    const year = useSelector(selectTsYear);
    const [dates, setDates] = useState([]);

    const changeMonth = (val) => {

        if (month + val == -1) {
            dispatch(changeTsMonth(11));
            dispatch(changeTsYear(year - 1))
        } else if (month + val == 12) {
            dispatch(changeTsMonth(0));
            dispatch(changeTsYear(year + 1))
        } else
            dispatch(changeTsMonth(month + val));
    }
    const changeYear = (val) => dispatch(changeTsYear(year + val));

    useEffect(() => {
        dispatch(listUsersReportAsync({ date: `${year}-${month + 1}-14` }));
        setDates(getDaysInMonth(month + 1, year));
    }, [dispatch, year, month])
    const fetchData = () => { dispatch(listUsersReportAsync({ date: `${year}-${month + 1}-14` })); }
    console.log(leaveData);
    const halfLeave = (user, date) => {
        return (
            <>
                <div className="left-half" >
                    {JSON.stringify(activity[user.id] && activity[user.id][date.date] ? `${activity[user.id][date.date].total} (${activity[user.id][date.date].activity}%)` : '')}
                </div>
                <div className='right-half'>0.5</div>
            </>
        )

    }
    return (
        <>
            <div className='ts-filter mb-2'>
                <div className='month-select'>
                    <BsFillArrowLeftCircleFill size={'30px'} onClick={() => changeMonth(-1)} />
                    <div className='month-name'>{mL[month]}</div>
                    <BsFillArrowRightCircleFill size={'30px'} onClick={() => changeMonth(1)} />
                </div>
                <div className='month-select'>
                    <BsFillArrowLeftCircleFill size={'30px'} onClick={() => changeYear(-1)} />
                    <div className='year-name'>{year}</div>
                    <BsFillArrowRightCircleFill size={'30px'} onClick={() => changeYear(1)} />
                </div>
                <div className='month-select'>
                    <IoIosRefreshCircle size={'30px'} onClick={fetchData} />
                </div>
            </div>
            <div className='me-4 ts-main-box no-scroll'>
                <Stack direction='horizontal'>
                    <Stack direction='vertical' className='name-list' >
                        <div className='ts-head'>Names</div>
                        {users && users.map((user, index) => {
                            return <div className='name' key={user.id}>
                                {user.work_from && user.work_from == 'home' ? <FaHome /> : user.work_from == 'office' ? <MdWork /> : ''}
                                <span>&nbsp;{user.name}</span>

                            </div>
                        })}
                    </Stack>
                    <Stack direction='vertical' className='date-time no-scroll' >
                        <Stack direction='horizontal' className='ts-head'>
                            {dates && dates.map((date, index) => {
                                return <div key={date} className={`dates ${date.day == 'Sunday' || date.day == 'Saturday' ? 'weekend' : ''}`} >{date.date} {date.day}</div>
                            })}
                        </Stack>
                        {users && users.map((user, index) => {
                            return <Stack key={`hr- ${user.id}`} className='tr'>
                                <Stack direction='horizontal' className='tr-data'>
                                    {dates && dates.map((date, index) => {
                                        return <div key={`hr - ${date.date}`} className={`date ${date.day == 'Sunday' || date.day == 'Saturday' ? 'weekend' : ''}`} >
                                            <div className = "userData">

                                                {
                                                    activity[user.id] && activity[user.id][date.date]
                                                        ?
                                                        `${activity[user.id][date.date].total} (${activity[user.id][date.date].activity}%)` : ''
                                                }

                                                <div className="leaveData">
                                                    
                                                    {leaveData[user.id] && leaveData[user.id][date.date]
                                                        ? `${leaveData[user.id][date.date].halfLeave == '1'
                                                            ? "leave"
                                                            : `${leaveData[user.id][date.date].half_day == '1'}`
                                                                ? "0.5"
                                                                : "0.5"}`
                                                        : ''}
                                                </div>

                                            </div>


                                        </div>

                                    })}
                                </Stack>
                            </Stack>
                        })}
                    </Stack>
                </Stack>
            </div>
        </>
    )
}
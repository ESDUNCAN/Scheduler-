import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => {
        setState({
          ...state,
          appointments
        })
        return res
      })
  }
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        setState({
          ...state,
          appointments
        })
        return res
      })
  }
  useEffect(() => {
    const responseDays = `http://localhost:8001/api/days`
    const responseAppointments = `http://localhost:8001/api/appointments`
    const responseInterviewers = `http://localhost:8001/api/interviewers`

    Promise.all([
      axios.get(responseDays),
      axios.get(responseAppointments),
      axios.get(responseInterviewers)
    ]).then((all) => {
      // console.log("ALL", all)
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [])
  return { state, setDay, bookInterview, cancelInterview }
}
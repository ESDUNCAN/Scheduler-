import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const updateSpots = (state) => {
    // find day and make a copy
    const dayToChange = state.days.find(day => day.name === state.day)
    const newDay = { ...dayToChange }

    //count how many free spots
    const emptyAppointments = dayToChange.appointments.filter(appointmentId => !state.appointments[appointmentId].interview)
    const spots = emptyAppointments.length

    //update spots in the newDay
    newDay.spots = spots

    //copy the days and replace old day with new day
    const newDays = [...state.days]
    const dayIndex = state.days.findIndex(day => day.name === state.day)
    newDays[dayIndex] = newDay

    //update the days in side the state

    const newState = { ...state }
    newState.days = newDays

    return newState
  }

  // const bookInterview = (interview, id) => {
  //   const newAppointment = {...state.appointments[id]}
  //   newApppointment.interview = interview

  //   const updatedAppoitments = {...state.appointments}
  //   updatedAppoitments[id] = newAppointment

  //   const newState = {...state}
  //   newState.appointments = updatedAppoitments

  //   const newNewState = updateSpots(newState)

  //   setState(newNewState)
  // }


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
    const newState = { ...state }
    newState.appointments = appointments
    const newNewState = updateSpots(newState)

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => {
        setState({ newNewState })
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
    const newState = { ...state }
    newState.appointments = appointments
    const newNewState = updateSpots(newState)

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        setState({ newNewState })
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
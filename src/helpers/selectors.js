
export function getAppointmentsForDay(state, day) {
  const dayObject = state.days.find(dObject => dObject.name === day)
  if (!dayObject) { return [] }

  return dayObject.appointments.map(appt => state.appointments[appt])
}

export function getInterview(state, interview) {
  if (!interview) {
    return null
  }
  return {
    ...interview, // keys of the interview object, could have been written as student:interview.student
    interviewer: state.interviewers[interview.interviewer]
  }
}
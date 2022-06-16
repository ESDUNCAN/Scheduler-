
// export function getAppointmentsForDay(state, day) {
//   let arr = []

//   state.days.map(daysObject => {
//     if (state.days === day) {
//       daysObject.appointment.forEach(appointmentsId => arr.push(appointmentsId))
//     }
//   })
//   return arr
// }

export function getAppointmentsForDay(state, day) {
  const dayObject = state.days.find(dObject => dObject.name === day)
  if (!dayObject) { return [] }

  return dayObject.appointments.map(appt => state.appointments[appt])
}
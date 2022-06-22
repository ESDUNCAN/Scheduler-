import React from 'react'
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form"
import Status from "./Status"
import Confirm from "./Confirm"
import Error from "./Error"

import useVisualMode from "hooks/useVisualMode";



export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }
  function cancel() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(() => { transition(EMPTY) })
      .catch(() => transition(ERROR_DELETE, true))
  }
  function edit() {
    transition(EDIT)
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={edit}
        />
      )}
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          name={props.name ? props.name : props.interview.student}

        />
      }
      {mode === SAVING && <Status message={SAVING} />}
      {mode === CONFIRM && <Confirm message="Please confirm you want to delete" onCancel={back} onConfirm={cancel} />}
      {mode === DELETING && <Status message={DELETING} />}
      {mode === EDIT &&
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          name={props.name ? props.name : props.interview.student}
          interviewer={props.value ? props.value : props.interview.interviewer.id}
        />
      }
      {mode === ERROR_SAVE && <Error message="Sorry could not create appointment at the time, please try again later"
        onClose={back}
      />}
      {mode === ERROR_DELETE && <Error message="Sorry could not delete appointment at the time, please try again later"
        onClose={back}
      />}

    </article>
  );
}
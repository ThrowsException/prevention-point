import React from "react"
import { observer } from "mobx-react"
import participantStore from "../stores/ParticipantStore"

export default
@observer
class Participant extends React.Component {
  render() {
    const store = participantStore
    return (
      <div>
        <p>Participants</p>
        <div className="participants">
          {store.participants.map(participant => (
            <p key={participant}>{participant.first_name}yes</p>
          ))}
        </div>
      </div>
    )
  }
}

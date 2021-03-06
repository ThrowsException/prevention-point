import React, { useContext } from "react"
import { observer } from "mobx-react-lite"
import { useHistory } from "react-router-dom"
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import PrevPointInput from "./Input/PrevPointInput"
import PrevPointButton from "./PrevPointButton"
import PrevPointCopy from "./Typography/PrevPointCopy"
import { rootStoreContext } from "../stores/RootStore"
import PrevPointHeading from "./Typography/PrevPointHeading"

const ParticipantSearch = observer(({ handleDrawerClose }) => {
  const rootStore = useContext(rootStoreContext)
  const participantStore = rootStore.ParticipantStore
  const history = useHistory()

  const handleSubmit = e => {
    e.preventDefault()
    // Validate that a participant id or a first name last name paring exist on the form
    if (!Object.keys(participantStore.params).length) {
      participantStore.setErrorMessageForParticipantSearch(
        "Need to enter a participant id or a name"
      )
      participantStore.setErrorStateForParticipantSearch(true)
    } else {
      handleDrawerClose()
      participantStore.getParticipants()
      history.push("/participants")
    }
  }

  return (
    <Container className="participant-search">
      <Grid
        container
        component="form"
        onSubmit={handleSubmit}
        className="participant-search__form"
      >
        <Grid item xs={12}>
          <PrevPointHeading className="participant-search__heading">
            Participant Search
          </PrevPointHeading>
          <PrevPointCopy className="participant-search__copy">
            <b>Reminder:</b> Search for participant profile prior to creating a
            new profile
          </PrevPointCopy>
        </Grid>
        <Grid item xs={12}>
          <FormControl error={participantStore.errorState}>
            <InputLabel htmlFor="participant_id">Participant ID</InputLabel>
            <PrevPointInput
              id="participant_id"
              name="pp_id"
              value={participantStore.params.pp_id}
              onChange={e => participantStore.handleParamChange(e.target)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <PrevPointHeading className="participant-search__heading">
            Or
          </PrevPointHeading>
        </Grid>
        <Grid item xs={12}>
          <FormControl error={participantStore.errorState}>
            <InputLabel htmlFor="first_name">First Name</InputLabel>
            <PrevPointInput
              id="first_name"
              name="first_name"
              value={participantStore.params.firstName}
              onChange={e => participantStore.handleParamChange(e.target)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl error={participantStore.errorState}>
            <InputLabel htmlFor="last_name">Last Name</InputLabel>
            <PrevPointInput
              id="last_name"
              name="last_name"
              value={participantStore.params.lastName}
              onChange={e => participantStore.handleParamChange(e.target)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <PrevPointButton
            type="submit"
            disabled={participantStore.toggleSearch}
          >
            Submit
          </PrevPointButton>
          <PrevPointCopy className="error-message">
            {participantStore.errorMessage}
          </PrevPointCopy>
        </Grid>
      </Grid>
    </Container>
  )
})

export default ParticipantSearch

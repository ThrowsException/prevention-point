import React from "react"
import { observer } from "mobx-react"
import ParticipantStore from "../stores/ParticipantStore"

import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

export default
@observer
class Participant extends React.Component {
  componentDidMount() {
    ParticipantStore.getParticipants()
  }

  render() {
    return (
      <div>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="textPrimary">Search Results</Typography>
        </Breadcrumbs>
        <Typography variant="h5" color="textPrimary">
          Participants
        </Typography>
        <div className="participants">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>#</Typography>
                </TableCell>
                <TableCell>
                  <Typography>PPID</Typography>
                </TableCell>
                <TableCell>
                  <Typography>First Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Last Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Address</Typography>
                </TableCell>
                <TableCell>
                  <Typography>DOB</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Add</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ParticipantStore.participants.map((participant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>Number</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{participant.pp_id} </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{participant.first_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{participant.last_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>Address</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>DOB</Typography>
                  </TableCell>
                  <TableCell>
                    <Fab color="primary" size="small" aria-label="add">
                      <AddIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Fab color="primary" aria-label="add" size="large">
          <AddIcon />
        </Fab>
        <div>
          <p>{ParticipantStore.filter("T9FN3", null, null).first_name}</p>
        </div>
      </div>
    )
  }
}

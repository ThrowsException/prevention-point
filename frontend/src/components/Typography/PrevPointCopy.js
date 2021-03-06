import React from "react"
import PropTypes from "prop-types"
import Typography from "@material-ui/core/Typography"

const PrevPointCopy = props => {
  // Theme styling applied with createMuiTheme.
  // can add modifiers with a class selector, for things like margin or color

  const { children, className } = props

  return (
    <Typography
      display="block"
      component="p"
      variant="body1"
      className={className}
    >
      {children}
    </Typography>
  )
}

PrevPointCopy.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default PrevPointCopy

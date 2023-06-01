// Edit room form styles
const editRoomFormStyles = (theme) => ({
  formPaper: {
    padding: "2rem",
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    [theme.breakpoints.up("md")]: { width: "50%" },
  },
  submitButton: {
    margin: "1rem 0",
    color: "#fff",
    backgroundImage: "linear-gradient(to right, rgba(46,49,146,1) 13%, rgba(27,255,255,1) 96%)",
    transition: "0.5s",
    backgroundSize: "200% auto",
    "&:hover": {
      backgroundPosition: "right center",
    },
    "&:disabled": {
      background: "#829baf",
      color: "#e3f2fd",
    },
  },
});

export default editRoomFormStyles;

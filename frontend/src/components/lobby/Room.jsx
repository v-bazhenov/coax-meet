import React, {Component} from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {withStyles} from "@material-ui/core/styles";
import {withTranslation} from "react-i18next";

// Utility components, functions, constants, objects...
import roomStyles from "./room_styles";
import {WEEKDAYS} from "../utilities/CONSTANTS.jsx";
import {axiosInstance, refreshingAccessToken, UserInfoContext} from "../utilities/index.jsx";
import EditRoomForm from "./RoomForm/EditRoomForm.jsx";

class Room extends Component {
    static contextType = UserInfoContext;
    state = {
        isEditFormVisible: false,
    };
    toggleEditForm = () => {
        this.setState((prevState) => ({
            isEditFormVisible: !prevState.isEditFormVisible,
        }));
    };

    handleRoomFormSubmit = async (data, {resetForm}) => {
        const roomData = {
            user: data.user,
            title: data.title,
            description: data.description,
            weekdays: data.weekdays,
            time: data.time,
            remindBefore: data.remindBefore,
            members: data.members,
            roomId: data.roomId,
        };
        const {printFeedback, closeRoomForm} = this.props;
        const {t} = this.props;

        // First refreshes JWT access token stored in local storage if access token is invalid
        await refreshingAccessToken();

        // Then posts the data to backend with the valid access token in the header
        await axiosInstance
            .patch("meet/rooms/" + roomData.roomId + "/", roomData)
            .then(() => {
                // After successfully posting form these tasks are performed in order
                resetForm();
                closeRoomForm();
                printFeedback({type: "success", feedbackMsg: t("Room edited")});
                this.props.loadRooms();
            })
            .catch((error) => {
                if (error.response) {
                    // console.log(error.response["data"]["title"])
                    const {status} = error.response;
                    // Error is feedback is printed to user if user is not logged in
                    if (status === 401 || status === 400) {
                        closeRoomForm();
                        printFeedback({
                            type: "error",
                            feedbackMsg: Object.values(error.response["data"])[0][0],
                        });
                    }
                }

            });
    };

    render() {
        const {isEditFormVisible} = this.state;
        const {userId} = this.context;
        const {
            apiData: {id, title, description, time, createdAt, roomId, user, weekdays, members, remindBefore},
            classes,
            deleteRoom,
            enterRoom,
        } = this.props;
        const {t} = this.props;
        return (
            <Accordion>
                {/* Head */}
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography className={classes.heading}>{title}</Typography>
                    <Typography className={classes.secondaryHeading}>
                        {time} &nbsp;
                        {weekdays.map((weekdayNumber) => WEEKDAYS[weekdayNumber]).join(', ')}
                        <br/>
                        {t('Remind Before')} {remindBefore} {t('minutes')}
                    </Typography>
                </AccordionSummary>

                {/* Description */}
                <AccordionDetails>
                    <div className={classes.gridContainer}>
                        <div className={classes.gridItemA}>
                            <Typography
                                style={{fontWeight: "bolder"}}
                                gutterBottom
                                variant="h5"
                            >
                                {title}
                            </Typography>
                            <Typography variant="caption" style={{color: "gray"}}>
                                {t('Created at')} {createdAt}
                            </Typography>
                            <Typography variant="body1">{description}</Typography>
                            &nbsp;
                            <Typography variant="body1" style={{color: "gray"}}>
                                {t('Members')}: {members.map((member) => member.fullName).join(', ')}
                            </Typography>
                        </div>

                        <div className={classes.gridItemB}>
                            <ButtonGroup
                                fullWidth
                                size="small"
                                orientation="vertical"
                                variant="contained"
                            >
                                {/* Delete button is only shown if the room belongs to current user */}
                                {userId === user ? (
                                    <Button
                                        style={{transition: "0.5s"}}
                                        color="secondary"
                                        onClick={() => deleteRoom(id)}
                                    >
                                        {t('Delete Room')}
                                    </Button>
                                ) : null}

                                {/* Edit Room Button */}
                                {userId === user ? (
                                    <Button
                                        color="primary"
                                        onClick={this.toggleEditForm}
                                    >
                                        {t('Edit Room')}
                                    </Button>
                                ) : null}

                                {/* Edit Room Form */}
                                {isEditFormVisible && (
                                    <EditRoomForm
                                        roomId={id}
                                        onRoomFormSubmit={this.handleRoomFormSubmit}
                                        toggleEditForm={this.toggleEditForm}
                                        closeForm={() => this.setState({ isEditFormVisible: false })}
                                    />
                                )}

                                <Button
                                    className={classes.enterBtn}
                                    onClick={() => enterRoom(id)}
                                    color="primary"
                                >
                                    {t('Enter Room')}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        );
    }
}

export default withStyles(roomStyles)(withTranslation()(Room));

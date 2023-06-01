import React, {Component} from "react";
import {Formik, Form} from "formik";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";

// Material UI components
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import WeekdayMultiSelect from "./WeekdayMultiSelect";

// Utility components, functions, constants, objects...
import {
    FormikUIField,
    UserInfoContext,
} from "../../utilities";
import {withTranslation} from "react-i18next";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {BASE_API_URL} from "../../utilities/CONSTANTS.jsx";
import editRoomFormStyles from "./edit_room_form_styles.jsx";

class EditRoomForm extends Component {
    static contextType = UserInfoContext;

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            selectedWeekdays: [],
            selectedMembers: [],
            memberOptions: [],
            selectedHour: "10",
            selectedMinute: "00",
            selectedRemindBefore: "10",
            loading: true,
            time: "",
        };
    }

    fetchRoomData = async (roomId) => {
        try {
            // Fetch room data from the backend based on the roomId
            const response = await fetch(`${BASE_API_URL}meet/rooms/${roomId}/`);
            const data = await response.json();

            // Parse and update the selected weekdays state
            const {weekdays, title, description, time, remindBefore} = data;
            const selectedHour = time.split(":")[0];
            const selectedMinute = time.split(":")[1];
            const selectedRemindBefore = remindBefore
            const selectedMembers = data.members.map((member) => ({
                id: member.id,
                fullName: member.fullName,
            }));
            const selectedWeekdays = weekdays
            this.setState({
                selectedWeekdays, title, description, time,
                selectedRemindBefore, selectedHour, selectedMinute, selectedMembers, loading: false
            }); // Update the loading state
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };

    componentDidMount() {
        const {roomId} = this.props;
        this.fetchRoomData(roomId).then(r => console.log("Room data fetched!"));
    }

    handleWeekdaysChange = (selectedWeekdays) => {
        this.setState({selectedWeekdays});
    };

    handleHourChange = (event) => {
        this.setState({selectedHour: event.target.value});
    };

    handleMinuteChange = (event) => {
        this.setState({selectedMinute: event.target.value});
    };

    handleRemindBeforeChange = (event) => {
        this.setState({selectedRemindBefore: event.target.value});
    };

    handleMembersChange = (event, selectedMembers) => {
        this.setState({selectedMembers});
    };

    fetchMembers = async (searchQuery) => {
        try {
            // Check if access token exists in localStorage
            const token = localStorage.getItem("access");
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(
                `${BASE_API_URL}auth/users/?search=${searchQuery}`,
                {
                    headers: headers,
                }
            );

            const data = await response.json();

            // Filter out already selected members from the options
            const filteredOptions = data.filter((option) => {
                const isAlreadySelected = this.state.selectedMembers.some(
                    (selectedMember) => selectedMember.id === option.id
                );
                return !isAlreadySelected;
            });

            this.setState({memberOptions: filteredOptions});
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    onRoomFormSubmit = async (values, {resetForm}) => {
        const {
            selectedWeekdays,
            selectedMembers,
            selectedHour,
            selectedMinute,
            selectedRemindBefore,
        } = this.state;
        const {onRoomFormSubmit} = this.props;

        const memberIds = selectedMembers.map((member) => member.id);
        const roomData = {
            ...values,
            roomId: this.props.roomId,
            weekdays: selectedWeekdays,
            members: memberIds,
            time: `${selectedHour}:${selectedMinute}`,
            remindBefore: selectedRemindBefore,
        };

        await onRoomFormSubmit(roomData, {resetForm});
        this.props.closeForm();
    };

    render() {
        const {t, classes} = this.props;
        const {userId} = this.context;
        const {
            loading,
            selectedWeekdays,
            memberOptions,
            title,
            description,
            selectedRemindBefore,
            selectedHour,
            selectedMinute,
            selectedMembers
        } = this.state;

        // Instantiating form fields with pretty much empty values
        const initialValues = {
            user: userId,
            title: title,
            description: description,
        };

        if (loading) {
            return <div>Loading...</div>; // Render a loading state until the data is fetched
        }


        return (
            <Paper className={classes.formPaper} elevation={3}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.onRoomFormSubmit}
                    // validationSchema={roomFormValidationSchema}
                >
                    {({isValid, dirty, errors}) => (
                        <Form>
                            <Typography align="center" variant="h4">
                                {t("Edit Room")}
                            </Typography>

                            {/* Title */}
                            <FormikUIField
                                name="title"
                                label={t("Title")}
                                type="text"
                                // value={initialValues.data.title}
                                fullWidth
                                error={errors.title}
                                // onChange={this.handleTitleChange}
                            />

                            {/* Description */}
                            <FormikUIField
                                name="description"
                                label={t("Event description")}
                                type="text"
                                // value={initialValues.data.description}
                                fullWidth
                                error={errors.description}
                                multiline
                                rows={4}
                                required

                            />

                            {/* Weekdays */}
                            <WeekdayMultiSelect
                                selectedWeekdays={selectedWeekdays}
                                value={selectedWeekdays}
                                onChange={this.handleWeekdaysChange}
                                t={t}
                                multiline
                                rows={4}
                            />

                            {/* Members */}
                            <Autocomplete
                                multiple
                                fullWidth
                                options={memberOptions}
                                value={selectedMembers}
                                getOptionLabel={(option) => option.fullName}
                                onChange={this.handleMembersChange}
                                onInputChange={(event, value) => this.fetchMembers(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="members"
                                        label={t("Members")}
                                        fullWidth
                                        error={errors.members}
                                    />
                                )}
                            />

                            {/* Time */}
                            <FormControl fullWidth>
                                <InputLabel>{t("Time")}</InputLabel>
                                <Select
                                    // name="timeHour"
                                    value={selectedHour}
                                    onChange={this.handleHourChange}
                                >
                                    {Array.from(Array(24).keys()).map((hour) => (
                                        <MenuItem
                                            key={hour}
                                            value={hour.toString().padStart(2, "0")}
                                        >
                                            {hour.toString().padStart(2, "0")}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    // name="timeMinute"
                                    value={selectedMinute}
                                    onChange={this.handleMinuteChange}
                                >
                                    {Array.from(Array(60 / 5).keys()).map((index) => (
                                        <MenuItem
                                            key={index}
                                            value={(index * 5).toString().padStart(2, "0")}
                                        >
                                            {(index * 5).toString().padStart(2, "0")}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Remind Before */}
                            <FormControl fullWidth>
                                <InputLabel>{t("Remind Before")}</InputLabel>
                                <Select
                                    value={selectedRemindBefore}
                                    name="remindBefore"
                                    onChange={this.handleRemindBeforeChange}
                                >
                                    {Array.from(Array(60 / 5 + 1).keys()).map((index) => (
                                        <MenuItem key={index} value={(index * 5).toString()}>
                                            {(index * 5).toString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Submit button */}
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                // disabled={!isValid || !dirty}
                                className={classes.submitButton}
                            >
                                {t("Save")}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        );
    }
}

export default withStyles(editRoomFormStyles)(
    withTranslation()(EditRoomForm)
);

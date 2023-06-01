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
import createRoomFormStyles from "./create_room_form_styles";
import {withTranslation} from "react-i18next";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {BASE_API_URL} from "../../utilities/CONSTANTS.jsx";

class CreateRoomForm extends Component {
    static contextType = UserInfoContext;

    constructor(props) {
        super(props);
        this.state = {
            selectedWeekdays: [],
            selectedMembers: [],
            memberOptions: [],
            selectedHour: "10",
            selectedMinute: "00",
            selectedRemindBefore: "10",
        };
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
            this.setState({memberOptions: data});
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    onRoomFormSubmit = async (values, {resetForm}) => {
        const {selectedWeekdays, selectedMembers, selectedHour, selectedMinute, selectedRemindBefore} = this.state;
        const {onRoomFormSubmit} = this.props;

        const memberIds = selectedMembers.map((member) => member.id);
        const roomData = {
            ...values,
            weekdays: selectedWeekdays,
            members: memberIds,
            time: `${selectedHour}:${selectedMinute}`,
            remindBefore: selectedRemindBefore
        };

        await onRoomFormSubmit(roomData, {resetForm});
    };

    render() {
        const {t, classes} = this.props;
        const {userId} = this.context;
        const {selectedWeekdays, memberOptions, selectedHour, selectedMinute, selectedRemindBefore} = this.state;

        // Instantiating form fields with pretty much empty values
        const initialValues = {
            user: userId,
            title: "",
            description: "",
            weekdays: selectedWeekdays,
        };

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
                                {t("New Room")}
                            </Typography>

                            {/* Title */}
                            <FormikUIField
                                name="title"
                                label={t("Title")}
                                type="text"
                                required
                                fullWidth
                                error={errors.title}
                            />

                            {/* Description */}
                            <FormikUIField
                                name="description"
                                label={t("Event description")}
                                type="text"
                                fullWidth
                                error={errors.description}
                                multiline
                                rows={4}
                                required
                            />

                            {/* Weekdays */}
                            <WeekdayMultiSelect
                                selectedWeekdays={selectedWeekdays}
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
                                getOptionLabel={(option) =>
                                    option.fullName
                                }
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
                                    onChange={this.handleRemindBeforeChange}
                                >
                                    {Array.from(Array(60 / 5 + 1).keys()).map((index) => (
                                        <MenuItem
                                            key={index}
                                            value={(index * 5).toString()}
                                        >
                                            {(index * 5).toString()} {t("minutes")}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                fullWidth
                                disabled={!dirty || !isValid}
                                className={classes.createRoomBtn}
                                variant="contained"
                                type="submit"
                            >
                                {t("Create Room")}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        );
    }
}

export default withTranslation()(
    withStyles(createRoomFormStyles)(CreateRoomForm)
);

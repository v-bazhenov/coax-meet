import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Checkbox, ListItemText} from "@material-ui/core";

const WeekdayMultiSelect = ({onChange, t, selectedWeekdays}) => {
    const [selectedValues, setSelectedValues] = useState(selectedWeekdays || []);

    const weekdays = [
        {value: 1, label: t("Monday")},
        {value: 2, label: t("Tuesday")},
        {value: 3, label: t("Wednesday")},
        {value: 4, label: t("Thursday")},
        {value: 5, label: t("Friday")},
        {value: 6, label: t("Saturday")},
        {value: 0, label: t("Sunday")},
    ];

    const handleChange = (event) => {
        const selectedValues = event.target.value;
        setSelectedValues(selectedValues);
    };

    useEffect(() => {
        if (onChange) {
            onChange(selectedValues);
        }
    }, [selectedValues, onChange]);

    return (
        <FormControl fullWidth required>
            <InputLabel>{t("Weekdays")}</InputLabel>
            <Select
                required={true}
                rows={4}
                multiple
                value={selectedWeekdays}
                onChange={handleChange}
                renderValue={(selected) =>
                    selected
                        .map((value) =>
                            weekdays.find((weekday) => weekday.value === value).label
                        )
                        .join(", ")
                }
            >
                {weekdays.map((weekday) => (
                    <MenuItem key={weekday.value} value={weekday.value}>
                        <Checkbox checked={selectedWeekdays.includes(weekday.value)}/>
                        <ListItemText primary={weekday.label}/>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default WeekdayMultiSelect;

import * as yup from "yup";

let roomFormValidationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
});
export default roomFormValidationSchema;

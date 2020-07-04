export const onMutation = (mutation, variables, setInputError) => {
  setInputError(undefined); // Clean up previous error

  let valid = true;
  Object.keys(variables).forEach((k) => {
    if (!variables[k]) {
      setInputError(k.charAt(0).toUpperCase() + k.slice(1) + " is empty");
      valid = false;
    }
  });

  if (valid) {
    mutation({ variables: variables }).catch((_) => {});
  }
};

export const getFormError = (error) => {
  if (!error) return undefined;

  switch (error.type) {
    case "required":
      return "Field required";
    case "minLength":
      return "Field value is too short";
    case "maxLength":
      return "Field value is too long";
    default:
      return "Invalid field value";
  }
};

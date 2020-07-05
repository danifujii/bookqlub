export const onMutation = (mutation, variables) => {
  mutation({ variables: variables }).catch((e) => {
    console.log(e);
  });
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

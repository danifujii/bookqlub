export const onMutation = (mutation, variables) => {
  mutation({ variables: variables }).catch((e) => {
    console.log(e);
  });
};

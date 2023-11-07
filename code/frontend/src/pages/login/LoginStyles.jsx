
const styles = {
    container: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      marginTop: 1,
    },
    loginButton:{
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderBlockColor: '#000000',
        '&:hover': {
            backgroundColor: '#000000',
            borderColor: '#000000',
            boxShadow: 'none',
            borderBlockColor: '#000000',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#000000',
            borderColor: '#000000',
            borderBlockColor: '#000000',
        },
    },
    anonimoButton:{
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        color: '#000000',
        borderColor: '#000000',
        borderBlockColor: '#000000',
        '&:hover': {
            borderColor: '#000000',
            boxShadow: 'none',
            borderBlockColor: '#000000',
        },
        '&:active': {
            boxShadow: 'none',
            borderColor: '#000000',
            borderBlockColor: '#000000',
        },
    },
    usernameTextField:{
        '& label.Mui-focused': {
            color: '#FFD700',
          },
          '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#FFD700',
          },
          '& .MuiFilledInput-underline:before': {
            borderBottomColor: '#FFD700',
          },
    },
    passwordTextField:{
        '& label.Mui-focused': {
            color: '#FFD700',
          },
          '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#FFD700',
          },
          '& .MuiFilledInput-underline:before': {
            borderBottomColor: '#FFD700',
          },
    },

  };
  
  export default styles;
  
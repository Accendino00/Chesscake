
const styles = {
    grid: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      justifyContent: 'center',
      overflow: 'hidden',
      direction: 'column',
    },
    gridButtons:{
      justifyContent: 'center',
      alignItems: 'center',
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

    registerButton:{
      color:"#FFD700",
      textDecoration: 'underline',
      textDecorationColor: '#FFD700',
      '&:hover': {
        textDecoration: 'underline',
        textDecorationColor: '#FFD700',
      },
    },

    titleStyle: {
      margin: "0px 35px 0px -35px",
      color: "rgb(0 0 0)",
      fontWeight: "700",
      textShadow: "rgba(0, 0, 0, 0.5) 2px 2px 3px",
      fontFamily: "Lato, sans-serif",
    },
  };
  
  export default styles;
  
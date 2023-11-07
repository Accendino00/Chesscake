
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px auto',
    },
    form: {
      marginTop: 1,
    },
    registerButton:{
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
    textField:{
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#000000', // Change the border color to your desired color
      },
    },
    closeButton:{
        position: 'absolute',
        top:0,
        right:0,
        padding:'8px',
    },
    background:{
      position: 'fixed',
      display: 'flex',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paper:{
      position: 'relative',
      margin: '20px auto',
      borderRadius: '12px',
      padding: '5',
    },
    
  usernameHelperText: "Imposta un username",
  emailHelperText: "Imposta un indirizzo email",
  passwordHelperText: "Imposta una password",
  };
  
  export default styles;
const ChessGameStyles = {
    boxTimer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex",
        flexDirection: "row",
        marginBottom: "10px",
        width: "100%",
    },
    boxGameOver: {
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '20%', 
        height: '30%', 
        bgcolor: 'background.paper', 
        border: '0',
        p: 4,
        borderRadius: '5px',
    },
    divChessBoard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '50vh',
    },
    boxControlButtons: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        height: "10vh",
    },
    boxTurns: {
        display:"flex",
            justifyContent:"space-between",
            alignItems:"flex",
            flexDirection:"row",
            width: '100%',
    },
    boxWIP: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex",
        flexDirection: "column",
        height: "10vh",
    }
}

export default ChessGameStyles;
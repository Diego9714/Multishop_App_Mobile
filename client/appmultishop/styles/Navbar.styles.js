import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row', 
    alignItems: 'center',
    paddingTop:"5%",
    paddingLeft:"5%",
    paddingBottom:"2%",
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#CDCDE0',
  },
  logo: {
    width: "50%",
    height: "100%"
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // height: '40%',
    width: '80%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  messageInfo: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    paddingBottom: 20,
    // borderWidth: 2,
    borderBottomWidth: 2, // Agregando una línea de separación
    borderBottomColor: 'black' // Color de la línea de separación
  },  
  message: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginBottom: 20
  },
  buttonModal: {
    width: 150,
    height: 40,
    backgroundColor: "#5B97DC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonModalExit: {
    width: 150,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextModal: {
    color: "white",
    textAlign: "center",
  },
});

export default styles;

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
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // width: 300,
    padding: 20,
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
    // paddingBottom: 20
  },  
  message: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    marginBottom: 20
  },
  orderItem:{
    margin:10,
    backgroundColor: '#D0D0D0',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
  },
  orderText:{
    margin:5,
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
    marginTop: 20,
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

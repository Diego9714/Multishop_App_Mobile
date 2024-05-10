import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  list: {
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    // flex: 1
  },
  titlePage:{
    height: 150,
    alignItems: "center",
    // flex: 1
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "400",
  },
  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "90%",
    backgroundColor: '#EFEFEF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 20,
  },
  textInput: {
    padding: 10,
    height: 50,
    borderRadius: 15,
    width: "90%",
  },
  container: {
    backgroundColor: '#EFEFEF',
    marginHorizontal: 10,
    height: "60%",
    borderRadius: 20,
  },
  headerContainer: {
    backgroundColor: "#64a8d6",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerTitleButton: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    marginHorizontal: 10,
    height: '87%',
  },
  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 2,
    paddingVertical: 10,
    // backgroundColor: 'black'  
  },
  nameClient: {
    textAlign: "justify",
    width: '30%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tlfClient: {
    textAlign: "justify",
    width: '30%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginRight: "15%",
    borderRadius: 10,
  },
  buttonAction: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // marginRight: 10,
  },
  button: {
    backgroundColor: "#B9B9B9",
    borderRadius: 10,
    width: "100%",
    padding: 5,
    alignItems: "center",
    marginRight: "80%",

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300, // Ancho deseado del modal
    height: 300, // Alto deseado del modal
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    // padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4

  },
  titleModal:{
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 20,
  }
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: "30%",
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: 150,
    marginBottom: "5%",
  },
  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "80%",
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 30,
  },
  textInput: {
    flex: 1, // Take remaining space in the row
    padding: 10,
    height: 60,
    borderRadius: 15,
    color: '#5B97DC',
  },
  icon: {
    marginRight: 10, // Space between icon and text input
  },
  button:{
    width: 200,
    backgroundColor: "#5B97DC",
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 20
  }
});

export default styles;

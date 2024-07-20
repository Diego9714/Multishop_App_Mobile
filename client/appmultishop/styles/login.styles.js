import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  imgContainer: {
    width: '100%',
    height: '5%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '80%',
    height: '100%',
  },
  containerInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    width: '90%',
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    marginTop: '45%',
    marginBottom: '30%'
  },
  containerWelcome: {
    width: '80%',
    marginBottom: 40,
  },
  textWelcome: {
    fontSize: 25,
    color: '#38B0DB',
    fontFamily: "Roboto",
  },
  textDescription: {
    color: '#6D6D6D',
    marginTop: 5,
  },
  iconTop: {
    marginRight: 10,
    marginBottom: 20,
  },
  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    // marginTop: 30,
  },
  textInput: {
    flex: 1,
    padding: 10,
    height: 60,
    borderRadius: 15,
    color: '#38B0DB',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    width: 300,
    backgroundColor: '#3090b3',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.30,
    shadowRadius: 3.84,
    elevation: 15,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 18,
  }
});

export default styles;

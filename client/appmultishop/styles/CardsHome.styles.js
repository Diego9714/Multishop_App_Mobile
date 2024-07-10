import { StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  mainContainer:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.10)'
  },
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  cardContainer: {
    marginTop: "10%",
    width: "45%",
    height: "40%",
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4
  },
  title: {
    color: '#343434',
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  buttonCard: {
    backgroundColor: '#777777',
    padding: 6,
    borderRadius: 10,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  }
})

export default styles
import { StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardContainer: {
    marginTop: 30,
    width: 165,
    height: 165,
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
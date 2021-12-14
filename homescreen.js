import React, { useEffect, useState } from 'react';
import { ListItem, SearchBar, Input, Icon, Button } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { BottomSheet } from 'react-native-elements/dist/bottomSheet/BottomSheet';

function HomeScreen({ navigation, route }) {

  const dataModel = getDataModel();
  const [productList, setProductList] = useState(dataModel.getProductListCopy());
  const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)

  /**
   * Search Reference: https://snack.expo.dev/embedded/@aboutreact/example-of-search-bar-in-react-native?iframeId=ewbug1wk1e&preview=true&platform=ios&theme=dark
   */
  const [filteredList, setFilteredList] = useState(dataModel.getProductListCopy());
  const [search, setSearch] = useState('')
  console.log(search)

  /**
   * Bottom Sheet for Filters
   */
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    dataModel.subscribeToUpdates(() => {
      setProductList(dataModel.getProductListCopy());
    });
  }, []);

  const searchResults = (text) => {
    if (text) {
      const searchData = productList.filter(function (item) {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase()
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      setFilteredList(searchData)
      setSearch(text)
    }
    else {
      setFilteredList(dataModel.getProductListCopy())
      setSearch(text)
    }
  }

  /**
   * List of Items in 
   */
  const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: homevuColors.redShade },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    < View style={styles.mainContainer} >
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor:'rgba(0.5, 0.25, 0, 0.2)'}}>
        {list.map((l, i) => (
          <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
      <View style={styles.searchContainer}>
        <SearchBar
          containerStyle={styles.searchBar}
          placeholder="Search Item"
          platform="android"
          lightTheme={true}
          round={true}
          onChangeText={(text) => searchResults(text)}
          value={search}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            contentContainerStyle={styles.listContentContainer}
            data={search ? filteredList : productList}
            renderItem={({ item }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Display', { item: item, currentUser: currentUser })}>
                    <View style={[styles.listItem, styles.shadowProp]}>
                      <View style={styles.listItemImageContainer}>
                        <Image style={styles.listItemImage}
                          source={{ uri: item.image }} />
                      </View>
                      <View style={styles.listItemDetailsContainer}>
                        <Text style={styles.listItemTitle}>{item.title}</Text>
                        <View style={styles.listItemDetails}>
                          <Text style={styles.listItemPrice}>${item.price}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View >
      <TouchableOpacity
        style={[styles.listItemAddButton, styles.buttonShadowProp]}
        onPress={() => {
          navigation.navigate("Details", { currentUser: currentUser });
        }}>
        <Icon
          name='add'
          type='material-icons'
          color='white'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.listItemMessageButton, styles.buttonShadowProp]}
        onPress={() => {
          navigation.navigate("Messages", { currentUser: currentUser });
        }}>
        <Icon
          name='message'
          type='material-icons'
          color='white'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.listItemFilterButton, styles.buttonShadowProp]}
        onPress={() => {
          setIsVisible(true)
        }}>
        <Icon
          name='filter-list'
          type='material-icons'
          color='white'
        />
      </TouchableOpacity>

    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white'
  },
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listContainer: {
    paddingHorizontal: 30,
    paddingBottom: 10,
    width: '100%',
  },
  listContentContainer: {
    justifyContent: 'flex-start',
  },
  listItem: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  listItemImageContainer: {
  },
  listItemDetailsContainer: {
    padding: 15
  },
  listItemImage: {
    alignSelf: 'center',
    flex: 0.7,
    width: '100%',
    height: 250,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    resizeMode: 'cover'
  },
  listItemTitle: {
    flex: 0.7,
    fontSize: 18,
    fontWeight: 'bold'
  },
  listItemDescription: {
    flex: 0.7,
    fontSize: 14
  },
  listItemPrice: {
    marginTop: 2,
    flex: 0.7,
    fontSize: 12,
    fontWeight: 'bold',
    color: homevuColors.greenShade
  },
  listItemAddButton: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: '5%',
    marginVertical: '10%',
    backgroundColor: homevuColors.green,
    shadowColor: homevuColors.greenShade,
  },
  listItemMessageButton: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: '5%',
    marginVertical: '30%',
    backgroundColor: homevuColors.blue,
    shadowColor: homevuColors.blueShade,

  },
  listItemFilterButton: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: '5%',
    marginVertical: '50%',
    backgroundColor: homevuColors.yellow,
    shadowColor: homevuColors.yellowShade,

  },
  buttonShadowProp: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  searchContainer: {
    marginHorizontal: 20,
    backgroundColor: homevuColors.blueTint
  },
  searchBar: {
  }
});

export default HomeScreen;
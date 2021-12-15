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
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
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
        <TouchableOpacity
          style={[styles.listItemFilterButton]}
          onPress={() => {
            setIsVisible(true)
          }}>
          <Icon
            size={32}
            name='filter-list'
            type='material-icons'
            color={homevuColors.red}

          />
        </TouchableOpacity>
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
      <View style={[styles.menuContainer, styles.shadowProp]}>
        <TouchableOpacity
          style={[styles.listItemAddButton]}
          onPress={() => {
            navigation.navigate("Home", { currentUser: currentUser });
          }}>
          <Icon
            size={32}
            name='home'
            type='material-icons'
            color={homevuColors.red}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.listItemAddButton]}
          onPress={() => {
            navigation.navigate("Details", { currentUser: currentUser });
          }}>
          <Icon
            size={32}
            name='add-circle'
            type='material-icons'
            color={homevuColors.red}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listItemMessageButton]}
          onPress={() => {
            navigation.navigate("Messages", { currentUser: currentUser });
          }}>
          <Icon
            size={32}
            name='message'
            type='material-icons'
            color={homevuColors.red}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listItemFilterButton]}
          onPress={() => {
            //TODO: Navigate to Profile Page
          }}>
          <Icon
            size={32}
            name='person'
            type='material-icons'
            color={homevuColors.red}

          />
        </TouchableOpacity>
      </View>
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
    paddingBottom: '30%'
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
  buttonShadowProp: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  searchContainer: {
    flexDirection:'row',
    marginHorizontal: 20,
    alignItems: 'center'
  },
  searchBar: {
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'fixed',
    paddingHorizontal: 20,
    right: 0,
    left: 0,
    bottom: 0,
    height: '10%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

export default HomeScreen;
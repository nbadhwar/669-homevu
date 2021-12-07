import React, { useEffect, useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';

function HomeScreen({ navigation, route }) {

  const dataModel = getDataModel();
  const [productList, setProductList] = useState(dataModel.getProductListCopy());
  const [currentUser, setCurrentUser] = useState(route.params ? route.params.currentUser : null)
  console.log(currentUser)

  useEffect(() => {
    dataModel.subscribeToUpdates(() => {
      setProductList(dataModel.getProductListCopy());
    });
  }, []);

  return (
    <View><View style={styles.container}>
      <View style={styles.listContainer}>
        <Button
          title="Messages"
          onPress={() => {
            navigation.navigate("Messages", {currentUser: currentUser});
          }}
        />
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={productList}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Display', { item: item, currentUser: currentUser })}>
                  <View style={[styles.listItem, styles.shadowProp]}>
                    <Image style={styles.listItemImage}
                      source={{ uri: item.image }} />
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <View style={styles.listItemDetails}>
                      <Text style={styles.listItemPrice}>${item.price}</Text>
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
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listContainer: {
    padding: 30,
    width: '100%',
  },
  listContentContainer: {
    justifyContent: 'flex-start',
  },
  listItem: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 15,
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
  listItemImage: {
    alignSelf: 'center',
    flex: 0.7,
    width: 200,
    height: 200,
    resizeMode: 'contain'
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
    color: 'green'
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
  },
  buttonShadowProp: {
    shadowColor: homevuColors.greenShade,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
});

export default HomeScreen;
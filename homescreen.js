import React, { useEffect, useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getDataModel, homevuColors } from './DataModel';
import { color } from 'react-native-elements/dist/helpers';

function HomeScreen({ navigation }) {

  const dataModel = getDataModel();
  const [productList, setProductList] = useState(dataModel.getProductListCopy());
  console.log(productList)

  // const [checked, setChecked] = useState(false)

  useEffect(() => {
    console.log(dataModel)
    dataModel.subscribeToUpdates(() => {
      setProductList(dataModel.getProductListCopy());
    });
  }, []);

  return (
    <View><View style={styles.container}>
      <View style={styles.listContainer}>
        {/* Comment Out After Done with DetailScreen */}
        {/* <Button
        title="Data Model Tester"
        onPress={() => {
          dataModel.addItem({
            title: 'Blue Couch',
            type: 'Couch',
            description: "Lightly used. I really like it but doesn't suit my living room.",
            price: 450.00,
            image: "https://m.media-amazon.com/images/I/61A1RC8KeRL._AC_SL1500_.jpg",
            ar_model: "tbd"
          })
        }
        }
      /> */}
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={productList}
          renderItem={({ item }) => {
            return (
              <View style={[styles.listItem, styles.shadowProp]}>
                <Image style={styles.listItemImage}
                  source={{ uri: item.image }} />
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemDescription}>{item.description}</Text>
                <View style={styles.listItemDetails}>
                  {/* TODO: More Details in a row - availability, see more button */}
                  <Text style={styles.listItemPrice}>${item.price}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
      <TouchableOpacity
        style={[styles.listItemAddButton, styles.buttonShadowProp]}
        onPress={() => {
          navigation.navigate("Details");
        }}>
        <Icon
          name='add'
          type='material-icons'
          color='white'
        />
      </TouchableOpacity>
    </View>
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
  listItemName: {
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
import React, { useEffect, useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import { Image, FlatList, StyleSheet, Text, View } from 'react-native';
import { getDataModel } from './DataModel';
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
    <View style={styles.container}>
      <View style={styles.listContainer}>
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
                  <Text style={styles.listItemPrice}>{item.price}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>

      <Button
        title="Add New Product"
        onPress={() => {
          navigation.navigate("Details");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listContainer: {
    flex: 0.8,
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
  listItemButton: {
    flex: 0.2,
    alignSelf: screenLeft,
    height: 15,
    width: '50%',
  },
  listItemButtons: {
    flex: 0.2,
    flexDirection: 'row',

  }
});

export default HomeScreen;
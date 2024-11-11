import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddDish" component={AddDishScreen} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.cbutton} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('history');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load history.', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setHistory([]);
      Alert.alert('Success', 'All history has been cleared.');
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  const filteredHistory = useMemo(
    () => history.filter((item) => (actionFilter ? item.action.includes(actionFilter) : true)),
    [history, actionFilter]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>History</Text>
      <RNPickerSelect
        onValueChange={setActionFilter}
        items={[
          { label: 'All Actions', value: '' },
          { label: 'Added dish', value: 'Added dish' },
          { label: 'Deleted dish', value: 'Deleted dish' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Filter by Action', value: '' }}
      />
      <ScrollView>
        {filteredHistory.length === 0 ? (
          <Text style={styles.noItemsText}>No history available</Text>
        ) : (
          filteredHistory.map((item, index) => (
            <Animatable.View key={index} animation="fadeIn" duration={500} style={styles.historyItem}>
              <Text style={styles.historyText}>{item.timestamp}: {item.action}</Text>
            </Animatable.View>
          ))
        )}
      </ScrollView>
      <CustomButton title="Clear All History" onPress={clearHistory} />
      <CustomButton title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const timeString = date.toLocaleString();
      setCurrentTime(timeString);
    }, 1000);

    loadMenuItems();
    loadHistory();

    return () => clearInterval(interval);
  }, []);

  const loadMenuItems = async () => {
    try {
      const items = await AsyncStorage.getItem('menuItems');
      if (items !== null) {
        setMenuItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to load menu items.', error);
    }
  };

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('history');
      if (historyData !== null) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load history.', error);
    }
  };

  const filteredMenuItems = menuItems
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => (courseFilter ? item.course === courseFilter : true));

  const calculateAveragePriceByCourse = (course) => {
    const items = menuItems.filter((item) => item.course === course);
    return items.length > 0
      ? (items.reduce((acc, item) => acc + parseFloat(item.price), 0) / items.length).toFixed(2)
      : '0.00';
  };

  const deleteMenuItem = (index) => {
    const deletedItem = menuItems[index];
    setMenuItems(menuItems.filter((_, i) => i !== index));
    logHistory(`Deleted dish: ${deletedItem.name}`);
    saveMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const logHistory = async (action) => {
    const newHistory = [...history, { timestamp: new Date().toLocaleString(), action }];
    setHistory(newHistory);
    await AsyncStorage.setItem('history', JSON.stringify(newHistory));
  };

  const saveMenuItems = async (items) => {
    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save menu items.', error);
    }
  };

  const getCourseIcon = (course) => {
    switch (course) {
      case 'Starters': return <Icon name="food-apple" size={20} color="#F2D23D" />;
      case 'Mains': return <Icon name="food-steak" size={20} color="#F2D23D" />;
      case 'Desserts': return <Icon name="cupcake" size={20} color="#F2D23D" />;
      default: return null;
    }
  };

const getCourseImage = (course) => {
    switch (course) {
      case 'Starters': return require('./assets/starters-placeholder.jpg');
      case 'Mains': return require('./assets/mains-placeholder.jpg');
      case 'Desserts': return require('./assets/desserts-placeholder.jpg');
      default: return require('./assets/placeholder.jpg');
    }
  };

const handleDishImageClick = (dishName) => {
    const pendingOrders = 3;
    const successfulOrders = 5;

   Alert.alert(
  `Order Status for ${dishName}`,
  `🔴 Pending Orders: ${pendingOrders}\n🟢 Successful Orders: ${successfulOrders}`,
  [{ text: 'Close', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/restaurant-logo.png')} style={styles.logoImage} />
        <Text style={styles.logo}>Welcome To Christoffel's Restaurant App</Text>
      </View>

      <Text style={styles.dateTime}>{currentTime}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Dish"
        placeholderTextColor="#fafaf7"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <RNPickerSelect
        onValueChange={(value) => setCourseFilter(value)}
        items={[
          { label: 'All', value: '' },
          { label: 'Starters', value: 'Starters' },
          { label: 'Mains', value: 'Mains' },
          { label: 'Desserts', value: 'Desserts' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Filter by Course', value: '' }}
      />

      <ScrollView>
 
      <Text style={styles.subHeader}>😋 Available Dishes 🍽️ </Text>
        {filteredMenuItems.length === 0 ? (
          <Text style={styles.noItemsText}>No dishes match your search or filter. Add new dishes!</Text>
        ) : (
          filteredMenuItems.map((item, index) => (
            <Animatable.View key={index} animation="fadeInUp" duration={700} style={styles.dishItem}>
              <TouchableOpacity onPress={() => handleDishImageClick(item.name)}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.dishImage} />
                ) : (
                  <Image source={getCourseImage(item.course)} style={styles.dishImage} />
                )}
              </TouchableOpacity>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDescription}>{item.description}</Text>
              <Text style={styles.dishCourse}>
                { getCourseIcon(item.course)} {item.course}
              </Text>
              <Text style={styles.dishPrice}>R{parseFloat(item.price).toFixed(2)}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMenuItem(index)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))
        )}
        <Animatable.View animation="fadeInUp" duration={500}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddDish', { setMenuItems, menuItems })}
          >
            <Text style={styles.addButtonText}>Add New Dish</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Text style={styles.totalItems}>Total Items: {menuItems.length}</Text>

        <View style={styles.averagePriceContainer}>
          <Text style={styles.averagePrice}>Starters Avg: R{calculateAveragePriceByCourse('Starters')}</Text>
          <Text style={styles.averagePrice}>Mains Avg: R{calculateAveragePriceByCourse('Mains')}</Text>
          <Text style={styles.averagePrice}>Desserts Avg: R{calculateAveragePriceByCourse('Desserts')}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add Dish Screen
const AddDishScreen = ({ route, navigation }) => {
  const { setMenuItems, menuItems } = route.params;
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const addDish = async () => {
    if (!dishName || !description || !course || !price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please fill in all fields correctly, and make sure price is a positive number.');
    } else {
      const newDish = { name: dishName, description, course, price, imageUri };
      const updatedMenuItems = [...menuItems, newDish];
      setMenuItems(updatedMenuItems);
      await saveMenuItems(updatedMenuItems);
      logHistory(`Added dish: ${dishName}`);
      navigation.goBack();
    }
  };

  const logHistory = async (action) => {
    const historyData = await AsyncStorage.getItem('history');
    const history = historyData ? JSON.parse(historyData) : [];
    const newHistory = [...history, { timestamp: new Date().toLocaleString(), action }];
    await AsyncStorage.setItem('history', JSON.stringify(newHistory));
  };

  const saveMenuItems = async (items) => {
    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save menu items.', error);
    }
  };

  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else {
        setImageUri(response.uri);
      }
    });
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a New Dish</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        placeholderTextColor="#8a8a8a"
        value={dishName}
        onChangeText={setDishName}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        placeholderTextColor="#8a8a8a"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <RNPickerSelect
        onValueChange={(value) => setCourse(value)}
        items={[
          { label: 'Starters', value: 'Starters' },
          { label: 'Mains', value: 'Mains' },
          { label: 'Desserts', value: 'Desserts' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Course', value: '' }}
      />
      <TextInput
        style={styles.input}
        placeholder="Price (ZAR)"
        placeholderTextColor="#8a8a8a"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addImageButton} onPress={selectImage}>
        <Text style={styles.addImageButtonText}>Select Image</Text>
      </TouchableOpacity>
      
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
            <Text style={styles.removeImageText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer }>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addDish}>
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



// Styling
const colors = {
  beige: '#d3bc8b',
  taupe: '#8d7963',
  darkBrown: '#443031',
  offWhite: '#fafaf7',
  deepBrown: '#312224',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBrown,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dateTime: {
    color: colors.offWhite,
    fontSize: 14,
    textAlign: 'right',
  },
  searchInput: {
    backgroundColor: colors.deepBrown,
    color: colors.offWhite,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 20,
    color: colors.beige,
    marginVertical: 10,
  },
  noItemsText: {
    color: colors.taupe,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  dishItem: {
    backgroundColor: colors.taupe,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  dishName: {
    color: colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishDescription: {
    color: colors.offWhite,
    fontSize: 14,
    marginVertical: 5,
  },

  dishPrice: {
    color: colors.beige,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: colors.deepBrown,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.beige,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: colors.deepBrown,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalItems: {
    color: colors.offWhite,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  historyButton: {
    backgroundColor: colors.beige,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  historyButtonText: {
    color: colors.deepBrown,
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  dishImage: {
    width: 300,
    height: 150,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  addImageButton: {
    backgroundColor: '#8d7963',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  addImageButtonText: {
    fontSize: 16,
    color: '#F2D23D',
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  historyText: {
    color: '#F2D23D',
    fontSize: 14,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#FFD700',
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  removeImageButton: {
    backgroundColor: '#F2D23D',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#d3d3d3',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
  },
cbutton: {
    backgroundColor: '#8d7963',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },


});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.deepBrown,
    borderRadius: 8,
    color: colors.offWhite,
    paddingRight: 30,
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.deepBrown,
    borderRadius: 8,
    color: colors.offWhite,
    paddingRight: 30,
    marginVertical: 10,
  },
}
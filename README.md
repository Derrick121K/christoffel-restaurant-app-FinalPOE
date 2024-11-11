###Christoffel's Restaurant App

This is a cross-platform mobile app built with React Native for Christoffel's Restaurant, allowing dynamic menu management, order status checking, history tracking, and enhanced dish filtering capabilities. The app provides a user-friendly interface for Christoffel to add, view, and manage his custom menu.

Features

- **Dynamic Menu Management**: Users can add dishes with details such as name, description, course type, price, and an optional image.
- **Course Filtering and Search**: Filter dishes by course (Starters, Mains, Desserts) and search by dish name.
- **History Tracking**: Log and view actions such as adding or deleting dishes. Clear history functionality is also available.
- **Average Price Calculation**: Displays the average price for each course type on the home screen.
- **Order Status**: Provides a quick order status for each dish with an interactive image click.
- **Persistent Storage**: All data, including menu items and history, is saved using AsyncStorage.

 ###Getting Started

 ###Prerequisites

1. **Node.js** and **npm/yarn** installed on your machine.
2. **React Native CLI** or **Expo CLI** (depending on the setup).
3. **Android Studio** or **Xcode** for device emulation, or a physical device for testing.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Derrick121K/st10445255_part-2_dam-kapa.git
   ```
2. Navigate into the project directory:
   ```bash
   cd christoffel-restaurant-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

4. Run the app on an emulator or a device:
   ```bash
   npx react-native run-android   # for Android
   npx react-native run-ios       # for iOS
   ```

### Additional Setup

- Install required dependencies:
   ```bash
   npm install @react-navigation/native @react-navigation/stack react-native-async-storage/async-storage react-native-picker-select react-native-image-picker react-native-vector-icons react-native-animatable
   ```

## Screens

### 1. **Home Screen**
   - Displays the current date and time in real-time.
   - Search and filter options for navigating the menu items.
   - Lists all available dishes with details and icons.
   - Provides the average price per course (Starters, Mains, Desserts).
   - Allows deleting dishes with confirmation and logs each action to the history.
   - Button to navigate to **AddDishScreen** and **HistoryScreen**.

### 2. **Add Dish Screen**
   - Add a new dish with the following details:
      - **Name**
      - **Description**
      - **Course** (selectable from predefined options)
      - **Price** (numeric only)
      - **Image** (selectable from the device gallery)
   - Logs the addition action to the history.

### 3. **History Screen**
   - View all history logs (additions and deletions) with timestamps.
   - Filter by action type (Added or Deleted dishes).
   - Clear all history entries option with a confirmation alert.

## Changes from Part 2 to PoE (Final Version)

1. **History Screen**: 
   - Added a new screen to view action logs (adding and deleting dishes) with timestamps.
   - Added filter functionality to view only specific actions in history.
   - Option to clear all history entries.

2. **Average Price by Course**:
   - Implemented a calculation and display of the average price for each course type on the home screen.

3. **Course-Based Icons and Images**:
   - Added icons for each course (Starter, Main, Dessert).
   - Added placeholders for each course type image when adding a dish without a custom image.

4. **Order Status Alert**:
   - Added functionality to display a status message with pending and successful orders when clicking on a dish image.

5. **Persistent Data with AsyncStorage**:
   - Integrated AsyncStorage to save menu items and history persistently, even after closing the app.

6. **Refactoring and Styling**:
   - Refactored the code for better readability and modularity.
   - Enhanced styling using custom colors to align with the restaurant's color scheme:
      - Beige: `#d3bc8b`
      - Taupe: `#8d7963`
      - Dark Brown: `#443031`
      - Off-White: `#fafaf7`
      - Deep Brown: `#312224`

## Future Improvements

- Implement real-time order tracking with a backend system.
- Add user authentication for different access levels (e.g., admin vs. customer).
- Add more detailed history tracking with dish details.
  
## Demo

### YouTube Link
Demo Video -(https://youtu.be/iVXim5E--gU)

### GitHub Repository
GitHub - (https://github.com/Derrick121K/christoffel-restaurant-app-FinalPOE.git)

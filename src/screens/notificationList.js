import React from 'react'
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native'
import { ThemeProvider, Button, Input, Image } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'




const NotificationList = () => {

 
 
  return(
    <ThemeProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Text>TEST </Text>
      </ScrollView>
    </ThemeProvider>
  )


}

const theme = {
	Button: {
		raised: true
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 35
	},
	preloader: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default NotificationList
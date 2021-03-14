import React, { useContext } from 'react'
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native'
import { ThemeProvider, Button, Input, Image } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth';
import { AuthContext  } from '../context/firebaseContext';

const Login = (props) => {
	const { user } = useContext(AuthContext);

	const onSignIn = () => {
		auth()
		.signInWithEmailAndPassword('ttt@mail.com', 'tttttt')
		.then(() => {
			console.log('User account created & signed in!');
			//props.navigation.navigate('home')
		})
		.catch(error => {
			if (error.code === 'auth/email-already-in-use') {
				console.log('That email address is already in use!');
			}

			if (error.code === 'auth/invalid-email') {
				console.log('That email address is invalid!');
			}
			props.navigation.navigate('login')

			console.error(error);
		});
	}

	return(
		<ThemeProvider theme={theme}>
			<ScrollView style={styles.container}>
				<Image
					//source={{ uri: 'https://parkrunthailand.com/static/media/logo02.07caad86.png'}}
					style={{ width: 280, height: 100}}
					containerStyle={{ marginLeft: 'auto', marginRight: 'auto'}}
				/>
				<Input 
					leftIcon={
						<Icon 
							name='envelope-o'
							size={20}
							color="#4db6ac"
						/>
					}
					placeholder={' Email'}
				/>
				<Input 
					leftIcon={
						<Icon 
							name='user-o'
							size={20}
							color="#4db6ac"
						/>
					}
					secureTextEntry={true}
					placeholder={' Password'}
				/>
				<Button
					buttonStyle={{backgroundColor: '#4db6ac'}}
					title='Sign in'
					onPress={() => onSignIn()}
				/>
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

export default Login
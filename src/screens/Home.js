import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    FlatList,
} from 'react-native';

import GlobalStyle from '../utils/GlobalStyle';
import CPressable from '../utils/CPressable';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import sqlite from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setName, setAge, increaseAge, getCities } from '../redux/actions';

const db = sqlite.openDatabase(
    {
        name: 'MainDB',
        location: 'default',
    },
    () => { },
    error => { console.log(error) },
);


function Home({ navigation }) {
    const { name, age, cities } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    // const [name, setName] = React.useState('');
    // const [age, setAge] = React.useState();

    React.useEffect(() => {
        getData();
        dispatch(getCities());
    }, []);

    const getData = () => {
        try {
            /*             AsyncStorage.getItem('user')
                            .then(value => {
                                if (value != null) {
                                    let user = JSON.parse(value);
                                    setName(user.name);
                                    setAge(user.age);
                                }
                            }) */
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Name, Age FROM Users ",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            var userName = results.rows.item(0).Name;
                            var userAge = results.rows.item(0).Age;
                            dispatch(setName(userName));
                            dispatch(setAge(userAge));
                        }
                    }
                )
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updateData = async () => {
        if (name.length == 0) {
            Alert.alert('Warning!', 'Please write your name');
        } else {
            try {
                // var userName = {
                //     name: name,
                // }
                // await AsyncStorage.mergeItem('user', JSON.stringify(userName));
                // Alert.alert('Success!', 'Data is updated');
                // navigation.navigate('Home');
                db.transaction((tx) => {
                    tx.executeSql(
                        "UPDATE Users SET Name=?",
                        [name],
                        () => { Alert.alert('Success!', 'Data is updated'); },
                        err => { console.log(err); }
                    )
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const removeData = async () => {
        try {
            // await AsyncStorage.removeItem('user')
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM Users",
                    [],
                    () => { navigation.navigate('Login'); },
                    err => { console.log(err); }
                )
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.body}>
            <FlatList
                data={cities}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={[GlobalStyle.CustomFont, styles.text]}>
                            {item.country} has {item.city}.
                        </Text>
                    </View>
                )
                }
            />
            {/* <Text style={[
                GlobalStyle.CustomFont,
                styles.text
            ]}>
                Welcome {name}!
                {'\n'}
                Your age is {age}.
            </Text>
            <TextInput
                style={styles.input}
                placeholder='Enter your name'
                onChangeText={(value) => dispatch(setName(value))}
                defaultValue={name}
            />
            <CPressable
                title='Update'
                onPressHandler={updateData}
            />
            <CPressable
                title='Remove'
                onPressHandler={removeData}
            />
            <CPressable
                title='Age++'
                onPressHandler={() => dispatch(increaseAge())}
            /> */}
        </View >
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 40,
        // marginBottom: 20,
    },

    input: {
        width: 320,
        borderWidth: 1,
        borderColor: '#6464AF',
        borderRadius: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontSize: 24,
        marginTop: 40,
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#b1b1ff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#6464AF',
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Home;
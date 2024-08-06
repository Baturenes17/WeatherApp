import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TextInput, Pressable, Keyboard, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { weatherImages } from "../constants";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";

const { width, height } = Dimensions.get("window");
const Size = Math.min(width, height);

export const HomeScreen = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [days, setDays] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [weather, setWeather] = useState({});

    const handleSearch = value => {
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
                setShowSearch(true)
            })
        }
    }

    const handleLocations = (loc) => {
        console.log("location :", loc);
        setLocations([]);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data)
            console.log("got forecast : ", data);
            console.log("forecast days: ", data?.forecast?.forecastday);
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

    const { current, location} = weather;

    useEffect(()=>{
        fetchMyWeatherData();
    },[]);

    const fetchMyWeatherData = () => {
        fetchWeatherForecast({
            cityName : 'Kayseri',
            days : '7'
        }).then(data => {
            setWeather(data);
        })
    }

    return (
        <Pressable onPress={() => [Keyboard.dismiss()]}>
            <View style={styles.container} >
                <StatusBar style="light" />
                <Image
                    blurRadius={60}
                    style={styles.backgroundImage}
                    source={require("../assets/images/bg.png")} />

                <View>
                    <View style={styles.searchBar} >
                        <TextInput
                            placeholder="Search City"
                            placeholderTextColor={"#fff"}
                            style={{ fontSize: 17, width: "80%", textTransform: "uppercase", color: "#fff" }}
                            keyboardType="default"
                            onChangeText={handleTextDebounce}
                        />
                        <Pressable onPress={() => setShowSearch(false)}>
                            <MagnifyingGlassIcon size={26} color={"#fff"} />
                        </Pressable>

                    </View>



                    <View>
                        {
                            locations.length > 0 && showSearch ? (
                                <View style={{ width: Size * 0.9, height: Size * 0.4 }} >
                                    {
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            data={locations}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => handleLocations(item)}
                                                    key={index}
                                                    style={styles.listBox}
                                                >
                                                    <MapPinIcon size={20} color={"gray"} />
                                                    <Text style={{ marginLeft: Size / 30, fontSize: 17 }} >{item?.name} , {item?.country}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    }
                                </View>
                            ) : null
                        }
                    </View>
                </View>

                <View>
                    <Text style={{ fontSize: 25, color: "#fff" }} >{location?.name},
                        <Text style={{ fontSize: 20, color: "#C8C9C7" }} >{location?.country}</Text>
                    </Text>
                </View>

                <View>
                    <Image
                        source={weatherImages[current?.condition?.text]}
                        style={{ width: Size / 1.5, height: Size / 1.5 }}
                    />
                </View>

                <View style={{ alignItems: "center" }} >
                    <Text style={{ fontSize: Size / 7, fontWeight: "bold", color: "#fff" }} >{current?.temp_c}&#176;</Text>
                    <Text style={{ fontSize: Size / 20, color: "#fff" }} >{current?.condition?.text}</Text>
                </View>

                <View style={{ flexDirection: "row" }} >
                    <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: Size / 30 }} >
                        <Image
                            source={require("../assets/icons/wind.png")}
                            style={{ width: Size / 15, height: Size / 15 }}
                        />
                        <Text style={{ fontSize: Size / 18, color: "#fff", marginLeft: Size / 60 }} >{current?.wind_kph}km</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: Size / 30 }} >
                        <Image
                            source={require("../assets/icons/drop.png")}
                            style={{ width: Size / 15, height: Size / 15 }}
                        />
                        <Text style={{ fontSize: Size / 18, color: "#fff", marginLeft: Size / 60 }} >{current?.humidity}%</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: Size / 30 }} >
                        <Image
                            source={require("../assets/icons/sun.png")}
                            style={{ width: Size / 15, height: Size / 15 }}
                        />
                        <Text style={{ fontSize: Size / 18, color: "#fff", marginLeft: Size / 60 }} >6:30 AM</Text>
                    </View>
                </View>

                <View style={{ width: "100%", height: Size / 3, justifyContent: "space-between" }} >
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: Size / 75, paddingLeft: Size / 25 }} >
                        <CalendarDaysIcon size={25} color={"#fff"} />
                        <Text style={{ color: "#fff", fontSize: Size / 25, marginLeft: Size / 75 }} >Daily Forecast</Text>
                    </View>

                    <View style={{ height: Size / 3.7, width: "100%" }} >
                        <FlatList
                            data={weather?.forecast?.forecastday}
                            renderItem={({ item, index }) => (
                                <View key={index}
                                    style={{
                                        marginHorizontal: Size / 45,
                                        height: Size / 3.7,
                                        width: Size / 4,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#016A6D",
                                        borderRadius: Size / 25,
                                    }}

                                >
                                    <Image source={weatherImages[item?.day?.condition?.text]}
                                        style={{ width: Size / 8, height: Size / 8 }}
                                    />
                                    <Text style={{ color: "#fff", marginVertical: Size / 100 }} >{item.date} {index}</Text>
                                    <Text style={{ fontSize: Size / 20, color: "#fff", fontWeight: "700" }} >{item.day.avgtemp_c}&#176;</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Size / 7,
        paddingBottom: Size / 15
    },
    backgroundImage: {
        position: "absolute",
        width: width,
        height: height * 1.2
    },
    searchBar: {
        width: Size * 0.9,
        height: Size / 10,
        backgroundColor: "#d5d5d5",
        borderRadius: Size / 30,
        justifyContent: "space-between",
        paddingLeft: Size / 20,
        paddingRight: Size / 20,
        flexDirection: "row",
        alignItems: "center",
        opacity: 0.4
    },
    listBox: {
        width: Size * 0.9,
        height: Size / 8,
        backgroundColor: "red",
        borderRadius: Size / 30,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: Size / 20,
        borderBottomWidth: 2,
        backgroundColor: "#fff",
        borderColor: "#BBBBBA",
        flexDirection: "row"
    },
    dayList: {
        flexDirection: "row",
        alignItems: "center"
    },
    dayItem: {
        justifyContent: "center",
        alignItems: "center",
        width: Size / 5,
        height: Size / 5,
        backgroundColor: "gray",
        marginHorizontal: 5,
        borderRadius: Size / 30
    }
})